import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import Blog from '../models/Blog.js';

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Upload a raw buffer to Cloudinary and return the result.
 */
function uploadToCloudinary(buffer, folder, resourceType = 'auto') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Return a paginated, sorted list of published blogs.
 * sort: 'recent' | 'liked' | 'workshop'
 */
export async function listBlogs(page, limit, sort) {
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(50, parseInt(limit) || 12);

  let sortObj = { createdAt: -1 };
  if (sort === 'liked') sortObj = { likeCount: -1, createdAt: -1 };
  if (sort === 'workshop') sortObj = { workshopTag: 1, createdAt: -1 };

  let blogs, total;

  if (sort === 'liked') {
    const pipeline = [
      { $match: { status: 'published' } },
      { $addFields: { likeCount: { $size: '$likes' } } },
      { $sort: { likeCount: -1, createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'tourists',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData',
        },
      },
      {
        $addFields: {
          author: {
            _id: { $arrayElemAt: ['$authorData._id', 0] },
            fullName: { $arrayElemAt: ['$authorData.fullName', 0] },
            country: { $arrayElemAt: ['$authorData.country', 0] },
            initials: { $arrayElemAt: ['$authorData.initials', 0] },
            profilePicUrl: { $arrayElemAt: ['$authorData.profilePicUrl', 0] },
          },
        },
      },
      { $project: { authorData: 0 } },
    ];
    blogs = await Blog.aggregate(pipeline);
    total = await Blog.countDocuments({ status: 'published' });
  } else {
    total = await Blog.countDocuments({ status: 'published' });
    blogs = await Blog.find({ status: 'published' })
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'fullName country initials profilePicUrl');
  }

  return {
    blogs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Return all published + draft blogs belonging to a specific tourist.
 */
export async function listMyBlogs(touristId) {
  return Blog.find({
    author: touristId,
    status: { $in: ['published', 'draft'] },
  }).sort({ createdAt: -1 });
}

/**
 * Create a new blog, optionally uploading media to Cloudinary.
 */
export async function createBlog(touristId, body, file) {
  const { title, content, workshopTag, status } = body;

  if (!title || !content) {
    const e = new Error('title and content are required.');
    e.status = 400;
    throw e;
  }

  let mediaUrl = '';
  let mediaPublicId = '';
  let mediaType = '';

  if (file) {
    const isVideo = file.mimetype.startsWith('video/');
    const result = await uploadToCloudinary(
      file.buffer,
      'lankacrafts/blogs',
      isVideo ? 'video' : 'image'
    );
    mediaUrl = result.secure_url;
    mediaPublicId = result.public_id;
    mediaType = isVideo ? 'video' : 'image';
  }

  const blog = await Blog.create({
    title,
    content,
    workshopTag: workshopTag || '',
    mediaUrl,
    mediaPublicId,
    mediaType,
    author: touristId,
    status: status === 'draft' ? 'draft' : 'published',
  });

  const populated = await blog.populate('author', 'fullName country initials profilePicUrl');
  return populated;
}

/**
 * Update an existing blog owned by the tourist.
 * Throws 404 if not found, 403 if not the owner.
 */
export async function updateBlog(blogId, touristId, body, file) {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    const e = new Error('Blog not found.');
    e.status = 404;
    throw e;
  }
  if (!blog.author.equals(touristId)) {
    const e = new Error('You can only edit your own blogs.');
    e.status = 403;
    throw e;
  }

  const { title, content, workshopTag, status } = body;

  if (file) {
    const isVideo = file.mimetype.startsWith('video/');
    const result = await uploadToCloudinary(
      file.buffer,
      'lankacrafts/blogs',
      isVideo ? 'video' : 'image'
    );
    blog.mediaUrl = result.secure_url;
    blog.mediaPublicId = result.public_id;
    blog.mediaType = isVideo ? 'video' : 'image';
  }

  if (title) blog.title = title;
  if (content) blog.content = content;
  if (workshopTag !== undefined) blog.workshopTag = workshopTag;
  if (status) blog.status = status;

  await blog.save();

  const populated = await blog.populate('author', 'fullName country initials profilePicUrl');
  return populated;
}

/**
 * Soft-delete a blog (sets status to 'deleted').
 * Throws 404 if not found, 403 if not the owner.
 */
export async function deleteBlog(blogId, touristId) {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    const e = new Error('Blog not found.');
    e.status = 404;
    throw e;
  }
  if (!blog.author.equals(touristId)) {
    const e = new Error('You can only delete your own blogs.');
    e.status = 403;
    throw e;
  }

  blog.status = 'deleted';
  await blog.save();
}

/**
 * Toggle a like on a blog. Returns { liked, likeCount }.
 */
export async function toggleLike(blogId, touristId) {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    const e = new Error('Blog not found.');
    e.status = 404;
    throw e;
  }

  const alreadyLiked = blog.likes.some((id) => id.equals(touristId));
  if (alreadyLiked) {
    blog.likes.pull(touristId);
  } else {
    blog.likes.push(touristId);
  }
  await blog.save();

  return { liked: !alreadyLiked, likeCount: blog.likes.length };
}
