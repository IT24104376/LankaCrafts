import Craft from '../models/Craft.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

const MAX_IMAGES = 10;

export async function createCraft(artistId, craftData, files = []) {
  const {
    name,
    description,
    price,
    currency,
    category,
    images,
    stock,
    dimensions,
    weight,
    materials,
    tags,
  } = craftData;

  if (!name || !price || !category) {
    const e = new Error('name, price, and category are required.');
    e.status = 400;
    throw e;
  }

  // Parse stringified JSON fields
  let parsedDimensions = dimensions;
  let parsedWeight = weight;
  let parsedMaterials = materials;
  let parsedTags = tags;

  if (typeof dimensions === 'string') {
    try { parsedDimensions = JSON.parse(dimensions); } catch { parsedDimensions = {}; }
  }
  if (typeof weight === 'string') {
    try { parsedWeight = JSON.parse(weight); } catch { parsedWeight = {}; }
  }
  if (typeof materials === 'string') {
    try { parsedMaterials = JSON.parse(materials); } catch { parsedMaterials = []; }
  }
  if (typeof tags === 'string') {
    try { parsedTags = JSON.parse(tags); } catch { parsedTags = []; }
  }

  // VALIDATE IMAGE COUNT
  if (files && files.length > MAX_IMAGES) {
    const e = new Error(`Maximum ${MAX_IMAGES} images allowed.`);
    e.status = 400;
    throw e;
  }

  const uploadedImages = [];
  const uploadedPublicIds = [];

  try {
    // Upload images to Cloudinary
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage = file.mimetype.startsWith('image/');
        
        if (!isImage) {
          throw new Error('Only image files are allowed.');
        }

        const result = await uploadBufferToCloudinary(
          file.buffer,
          'lankacrafts/crafts',
          'image'
        );

        uploadedPublicIds.push(result.public_id);
        uploadedImages.push(result.secure_url);
      }
    }

    const craft = await Craft.create({
      artistId,
      name,
      description: description || '',
      price,
      currency: currency || 'LKR',
      category,
      images: uploadedImages,
      stock: stock ?? 1,
      dimensions: parsedDimensions || {},
      weight: parsedWeight || {},
      materials: parsedMaterials || [],
      tags: parsedTags || [],
      isAvailable: true,
    });

    return craft;

  } catch (err) {
    // Rollback uploaded files if something fails
    if (uploadedPublicIds.length > 0) {
      await deleteFromCloudinary(uploadedPublicIds);
    }
    throw err;
  }
}

export async function getCraftsByArtist(artistId) {
  return await Craft.find({ artistId }).sort({ createdAt: -1 });
}

export async function getCraftById(craftId) {
  const craft = await Craft.findById(craftId);
  if (!craft) {
    const e = new Error('Craft not found.');
    e.status = 404;
    throw e;
  }
  return craft;
}

export async function updateCraft(craftId, artistId, updates, files = []) {
  const craft = await Craft.findOne({ _id: craftId, artistId });
  if (!craft) {
    const e = new Error('Craft not found or unauthorized.');
    e.status = 404;
    throw e;
  }

  // Parse stringified JSON fields
  let parsedDimensions = updates.dimensions;
  let parsedWeight = updates.weight;
  let parsedMaterials = updates.materials;
  let parsedTags = updates.tags;
  let parsedExistingImages = null;

  if (typeof updates.dimensions === 'string') {
    try { parsedDimensions = JSON.parse(updates.dimensions); } catch { parsedDimensions = undefined; }
  }
  if (typeof updates.weight === 'string') {
    try { parsedWeight = JSON.parse(updates.weight); } catch { parsedWeight = undefined; }
  }
  if (typeof updates.materials === 'string') {
    try { parsedMaterials = JSON.parse(updates.materials); } catch { parsedMaterials = undefined; }
  }
  if (typeof updates.tags === 'string') {
    try { parsedTags = JSON.parse(updates.tags); } catch { parsedTags = undefined; }
  }
  if (typeof updates.existingImages === 'string') {
    try { parsedExistingImages = JSON.parse(updates.existingImages); } catch { parsedExistingImages = null; }
  }

  const allowedUpdates = [
    'name', 'description', 'price', 'currency', 'category',
    'stock', 'isAvailable', 'dimensions', 'weight',
    'materials', 'tags'
  ];

  const updateData = {
    ...updates,
    dimensions: parsedDimensions,
    weight: parsedWeight,
    materials: parsedMaterials,
    tags: parsedTags
  };

  for (const key of allowedUpdates) {
    if (updateData[key] !== undefined) {
      craft[key] = updateData[key];
    }
  }

  // VALIDATE IMAGE COUNT
  if (files && files.length > MAX_IMAGES) {
    const e = new Error(`Maximum ${MAX_IMAGES} images allowed.`);
    e.status = 400;
    throw e;
  }

  const uploadedImages = [];
  const uploadedPublicIds = [];

  try {
    // Handle images: use existing images if no new files, otherwise combine
    if (parsedExistingImages !== null) {
      craft.images = parsedExistingImages;
    }
    
    // Upload new images to Cloudinary
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage = file.mimetype.startsWith('image/');
        
        if (!isImage) {
          throw new Error('Only image files are allowed.');
        }

        const result = await uploadBufferToCloudinary(
          file.buffer,
          'lankacrafts/crafts',
          'image'
        );

        uploadedPublicIds.push(result.public_id);
        uploadedImages.push(result.secure_url);
      }
      // Append new images to existing ones
      craft.images = [...craft.images, ...uploadedImages];
    }

    await craft.save();
    return craft;

  } catch (err) {
    // Rollback new uploads if error
    if (uploadedPublicIds.length > 0) {
      await deleteFromCloudinary(uploadedPublicIds);
    }
    throw err;
  }
}

export async function deleteCraft(craftId, artistId) {
  const craft = await Craft.findOneAndDelete({ _id: craftId, artistId });
  if (!craft) {
    const e = new Error('Craft not found or unauthorized.');
    e.status = 404;
    throw e;
  }
  return craft;
}

export async function getAllCrafts(filters = {}, sort = { createdAt: -1 }, page = 1, limit = 20) {
  const query = { isAvailable: true, ...filters };

  const skip = (page - 1) * limit;

  const [crafts, total] = await Promise.all([
    Craft.find(query)
      .populate('artistId', 'fullName craftType location profilePicUrl')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Craft.countDocuments(query)
  ]);

  return {
    crafts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

export async function getCraftsByCategory(category, page = 1, limit = 20) {
  return await getAllCrafts({ category }, { createdAt: -1 }, page, limit);
}

export async function searchCrafts(query, page = 1, limit = 20) {
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ],
    isAvailable: true
  };

  return await getAllCrafts(searchQuery, { createdAt: -1 }, page, limit);
}

export async function incrementCraftViews(craftId) {
  return await Craft.findByIdAndUpdate(craftId, { $inc: { views: 1 } });
}

export async function incrementCraftSales(craftId) {
  return await Craft.findByIdAndUpdate(craftId, { $inc: { salesCount: 1 } });
}
