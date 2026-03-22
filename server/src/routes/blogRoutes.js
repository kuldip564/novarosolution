import { Router } from 'express';
import {
  deleteAdminBlog,
  getAdminBlogPosts,
  getPublicBlogPostBySlug,
  getPublicBlogPosts,
  patchAdminBlog,
  postAdminBlog
} from '../controllers/blogController.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';

const blogRoutes = Router();

blogRoutes.get('/blog', getPublicBlogPosts);
blogRoutes.get('/blog/:slug', getPublicBlogPostBySlug);
blogRoutes.get('/admin/blog', requireAuth, requireAdmin, getAdminBlogPosts);
blogRoutes.post('/admin/blog', requireAuth, requireAdmin, postAdminBlog);
blogRoutes.patch('/admin/blog/:blogId', requireAuth, requireAdmin, patchAdminBlog);
blogRoutes.delete('/admin/blog/:blogId', requireAuth, requireAdmin, deleteAdminBlog);

export default blogRoutes;
