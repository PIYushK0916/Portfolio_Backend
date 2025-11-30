const express = require('express');
const { body } = require('express-validator');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  getBlogCategories,
  getPopularTags,
  getBlogStats
} = require('../controllers/blogController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { upload, handleMulterError, cleanupOnError } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const blogValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage('Title is required and must be less than 150 characters'),
  body('excerpt')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Excerpt is required and must be less than 300 characters'),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('category')
    .isIn([
      'web-development', 
      'mobile-development', 
      'ai-ml', 
      'data-science', 
      'programming-tips', 
      'career', 
      'tutorials', 
      'technology-trends', 
      'personal',
      'other'
    ])
    .withMessage('Invalid category'),
  body('tags')
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return false;
    })
    .withMessage('At least one tag is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status')
];

// Public routes
router.get('/', optionalAuth, getBlogs);
router.get('/categories', getBlogCategories);
router.get('/tags', getPopularTags);
router.get('/:slug', getBlog);
router.post('/:id/like', likeBlog);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router
  .route('/admin/stats')
  .get(getBlogStats);

router
  .route('/')
  .post(
    cleanupOnError,
    upload.single('featuredImage'),
    handleMulterError,
    blogValidation,
    createBlog
  );

router
  .route('/:id')
  .put(
    cleanupOnError,
    upload.single('featuredImage'),
    handleMulterError,
    blogValidation,
    updateBlog
  )
  .delete(deleteBlog);

module.exports = router;