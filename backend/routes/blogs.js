import express from 'express';
import multer from 'multer';
import { verifyFirebaseToken } from '../middleware/auth.js';
import {
  listBlogs,
  listMyBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
} from '../services/blogService.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/quicktime', 'video/webm',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type.'));
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tourist/blogs
// Public — list all published blogs with pagination & sorting
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const { page, limit, sort } = req.query;
  const result = await listBlogs(page, limit, sort);
  res.json(result);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tourist/blogs/me - with TOKEN
// Private — list all published and draft blogs by a specific user
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me', verifyFirebaseToken, async (req, res) => {
  const blogs = await listMyBlogs(req.tourist._id);
  res.json({ blogs });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/tourist/blogs
// Authenticated — create a new blog post (with optional Cloudinary media)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', verifyFirebaseToken, upload.single('media'), async (req, res) => {
  const blog = await createBlog(req.tourist._id, req.body, req.file);
  res.status(201).json({
    message: `Blog ${blog.status === 'draft' ? 'saved as draft' : 'published'} successfully.`,
    blog,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/tourist/blogs/:id/like
// Authenticated — toggle like on a blog
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/:id/like', verifyFirebaseToken, async (req, res) => {
  const result = await toggleLike(req.params.id, req.tourist._id);
  res.json(result);
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/tourist/blogs/:id
// Authenticated — edit own blog (and update status)
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/:id', verifyFirebaseToken, upload.single('media'), async (req, res) => {
  const blog = await updateBlog(req.params.id, req.tourist._id, req.body, req.file);
  res.json({ message: 'Blog updated successfully.', blog });
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/tourist/blogs/:id
// Authenticated — soft delete own blog
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  await deleteBlog(req.params.id, req.tourist._id);
  res.json({ message: 'Blog deleted successfully.' });
});

export default router;
