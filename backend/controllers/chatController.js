import Artist from '../models/Artist.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const getConversationParticipants = (conversation) => [
  conversation.artistUserId.toString(),
  conversation.touristUserId.toString(),
];

const ensureParticipant = (conversation, userId) => {
  if (!getConversationParticipants(conversation).includes(userId.toString())) {
    throw new AppError('Not authorized to access this conversation', 403);
  }
};

const getOtherParticipantId = (conversation, userId) =>
  conversation.artistUserId.toString() === userId.toString()
    ? conversation.touristUserId.toString()
    : conversation.artistUserId.toString();

const serializeMessage = (message, conversation) => ({
  id: message._id.toString(),
  conversationId: conversation._id.toString(),
  text: message.text,
  createdAt: message.createdAt,
  editedAt: message.editedAt,
  readAt: message.readAt,
  sender: {
    id: message.senderId._id.toString(),
    fullName: message.senderId.fullName,
    role: message.senderId.role,
  },
  recipient: {
    id: message.recipientId._id.toString(),
    fullName: message.recipientId.fullName,
    role: message.recipientId.role,
  },
});

const buildConversationSummary = async (conversation, currentUserId, onlineUsers) => {
  const [artistUser, touristUser, artistProfile] = await Promise.all([
    User.findById(conversation.artistUserId),
    User.findById(conversation.touristUserId),
    conversation.artistProfileId ? Artist.findById(conversation.artistProfileId) : null,
  ]);

  const isCurrentArtist = conversation.artistUserId.toString() === currentUserId.toString();
  const otherUser = isCurrentArtist ? touristUser : artistUser;
  const unread = conversation.unreadCounts?.get(currentUserId.toString()) || 0;

  if (!otherUser) {
    throw new AppError('Conversation participant no longer exists', 404);
  }

  return {
    id: conversation._id.toString(),
    otherUser: {
      id: otherUser._id.toString(),
      fullName: otherUser.fullName,
      email: otherUser.email,
      role: otherUser.role,
      country: otherUser.country,
    },
    artistProfile: artistProfile
      ? {
          id: artistProfile._id.toString(),
          username: artistProfile.username,
          craftType: artistProfile.craftType,
          region: artistProfile.region,
        }
      : null,
    lastMessage: conversation.lastMessage?.text || '',
    lastMessageAt: conversation.lastMessageAt,
    unread,
    online: onlineUsers?.has(otherUser._id.toString()) || false,
  };
};

const emitConversationUpdate = async (req, conversation, extraMessage = null) => {
  const io = req.app.get('io');
  const onlineUsers = req.app.get('onlineUsers');
  const participantIds = getConversationParticipants(conversation);

  for (const participantId of participantIds) {
    const summary = await buildConversationSummary(conversation, participantId, onlineUsers);
    io.to(`user:${participantId}`).emit('conversation:updated', summary);
  }

  if (extraMessage) {
    io.to(`conversation:${conversation._id.toString()}`).emit('message:new', extraMessage);
  }
};

const refreshConversationLastMessage = async (conversation) => {
  const latestMessage = await Message.findOne({ conversationId: conversation._id }).sort({ createdAt: -1 });

  if (!latestMessage) {
    conversation.lastMessage = {
      text: '',
      senderId: null,
      createdAt: null,
    };
    conversation.lastMessageAt = conversation.createdAt;
    return;
  }

  conversation.lastMessage = {
    text: latestMessage.text,
    senderId: latestMessage.senderId,
    createdAt: latestMessage.createdAt,
  };
  conversation.lastMessageAt = latestMessage.createdAt;
};

const markConversationReadInternal = async (conversation, userId) => {
  const currentUserId = userId.toString();
  const otherParticipantId = getOtherParticipantId(conversation, currentUserId);

  await Message.updateMany(
    {
      conversationId: conversation._id,
      recipientId: currentUserId,
      readAt: null,
    },
    { $set: { readAt: new Date() } }
  );

  conversation.unreadCounts.set(currentUserId, 0);
  await conversation.save();

  return {
    conversationId: conversation._id.toString(),
    userId: currentUserId,
    otherParticipantId,
  };
};

export const createConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.user.uid;

  if (req.user.role !== 'tourist') {
    throw new AppError('Only tourists can start a conversation with an artist', 403);
  }

  const { artistUserId, artistProfileId, openingMessage } = req.body;
  let artistUser = null;
  let artistProfile = null;

  if (artistProfileId) {
    artistProfile = await Artist.findById(artistProfileId);
    if (!artistProfile) {
      throw new AppError('Artist profile not found', 404);
    }
    artistUser = await User.findById(artistProfile.userId);
  } else if (artistUserId) {
    artistUser = await User.findById(artistUserId);
    if (artistUser?.role === 'artist') {
      artistProfile = await Artist.findOne({ firebaseUid: artistUser._id.toString() });
    }
  }

  if (!artistUser || artistUser.role !== 'artist') {
    throw new AppError('Artist account not found', 404);
  }

  let conversation = await Conversation.findOne({
    artistUserId: artistUser._id,
    touristUserId: currentUserId,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      artistUserId: artistUser._id,
      touristUserId: currentUserId,
      artistProfileId: artistProfile?._id || null,
      createdBy: currentUserId,
      unreadCounts: {
        [currentUserId]: 0,
        [artistUser._id.toString()]: 0,
      },
    });
  }

  if (openingMessage?.trim()) {
    req.params.id = conversation._id.toString();
    req.body.text = openingMessage;
    return sendMessage(req, res);
  }

  res.status(201).json({
    success: true,
    data: await buildConversationSummary(
      conversation,
      currentUserId,
      req.app.get('onlineUsers')
    ),
  });
});

export const getConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.user.uid;
  const conversations = await Conversation.find({
    $or: [{ artistUserId: currentUserId }, { touristUserId: currentUserId }],
  }).sort({ lastMessageAt: -1 });

  res.status(200).json({
    success: true,
    data: await Promise.all(
      conversations.map((conversation) =>
        buildConversationSummary(conversation, currentUserId, req.app.get('onlineUsers'))
      )
    ),
  });
});

export const getConversationMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  ensureParticipant(conversation, req.user.uid);

  const messages = await Message.find({ conversationId: conversation._id })
    .sort({ createdAt: 1 })
    .populate('senderId', 'fullName email role')
    .populate('recipientId', 'fullName email role');

  res.status(200).json({
    success: true,
    data: messages.map((message) => ({
      ...serializeMessage(message, conversation),
    })),
  });
});

export const markConversationRead = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  ensureParticipant(conversation, req.user.uid);
  const payload = await markConversationReadInternal(conversation, req.user.uid);
  await emitConversationUpdate(req, conversation);

  res.status(200).json({
    success: true,
    data: payload,
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  ensureParticipant(conversation, req.user.uid);

  const text = req.body.text?.trim();
  if (!text) {
    throw new AppError('Message text is required', 400);
  }

  const senderId = req.user.uid;
  const recipientId = getOtherParticipantId(conversation, senderId);

  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    recipientId,
    text,
  });

  const existingUnread = conversation.unreadCounts?.get(recipientId) || 0;
  conversation.lastMessage = {
    text,
    senderId,
    createdAt: message.createdAt,
  };
  conversation.lastMessageAt = message.createdAt;
  conversation.unreadCounts.set(recipientId, existingUnread + 1);
  conversation.unreadCounts.set(senderId, 0);
  await conversation.save();

  const populatedMessage = await Message.findById(message._id)
    .populate('senderId', 'fullName email role')
    .populate('recipientId', 'fullName email role');

  const responseMessage = serializeMessage(populatedMessage, conversation);

  await emitConversationUpdate(req, conversation, responseMessage);

  res.status(201).json({
    success: true,
    data: responseMessage,
  });
});

export const updateMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  ensureParticipant(conversation, req.user.uid);

  const message = await Message.findOne({
    _id: req.params.messageId,
    conversationId: conversation._id,
  });

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  if (message.senderId.toString() !== req.user.uid.toString()) {
    throw new AppError('You can only edit your own messages', 403);
  }

  const text = req.body.text?.trim();
  if (!text) {
    throw new AppError('Message text is required', 400);
  }

  message.text = text;
  message.editedAt = new Date();
  await message.save();

  if (conversation.lastMessage?.createdAt?.getTime?.() === message.createdAt.getTime()) {
    conversation.lastMessage = {
      text,
      senderId: message.senderId,
      createdAt: message.createdAt,
    };
    await conversation.save();
  }

  const populatedMessage = await Message.findById(message._id)
    .populate('senderId', 'fullName email role')
    .populate('recipientId', 'fullName email role');

  const responseMessage = serializeMessage(populatedMessage, conversation);
  await emitConversationUpdate(req, conversation);
  req.app.get('io')
    .to(`conversation:${conversation._id.toString()}`)
    .emit('message:updated', responseMessage);

  res.status(200).json({
    success: true,
    data: responseMessage,
  });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  ensureParticipant(conversation, req.user.uid);

  const message = await Message.findOne({
    _id: req.params.messageId,
    conversationId: conversation._id,
  });

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  if (message.senderId.toString() !== req.user.uid.toString()) {
    throw new AppError('You can only delete your own messages', 403);
  }

  await Message.deleteOne({ _id: message._id });
  await refreshConversationLastMessage(conversation);
  await conversation.save();
  await emitConversationUpdate(req, conversation);
  req.app.get('io')
    .to(`conversation:${conversation._id.toString()}`)
    .emit('message:deleted', {
      id: message._id.toString(),
      conversationId: conversation._id.toString(),
    });

  res.status(200).json({
    success: true,
    data: {
      id: message._id.toString(),
      conversationId: conversation._id.toString(),
    },
  });
});
