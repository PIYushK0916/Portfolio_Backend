const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats
} = require('../controllers/projectController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { upload, handleMulterError, cleanupOnError } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description is required and must be less than 500 characters'),
  body('category')
    .isIn(['web', 'mobile', 'desktop', 'ai/ml', 'data-science', 'other'])
    .withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'])
    .withMessage('Invalid status'),
  body('year')
    .isInt({ min: 2020, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be between 2020 and next year'),
  body('technologies')
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return false;
    })
    .withMessage('At least one technology is required'),
  body('demoUrl')
    .optional()
    .isURL()
    .withMessage('Demo URL must be a valid URL'),
  body('githubUrl')
    .optional()
    .matches(/^https?:\/\/(www\.)?github\.com\/.+/)
    .withMessage('GitHub URL must be a valid GitHub repository URL')
];

// Public routes
router.get('/', optionalAuth, getProjects);

// Admin protected routes (must come before public :slug route)
router.get('/admin/stats', protect, authorize('admin'), getProjectStats);
router.get('/admin/:id', protect, authorize('admin'), getProject);

router
  .route('/')
  .post(
    protect,
    authorize('admin'),
    cleanupOnError,
    upload.array('images', 10),
    handleMulterError,
    projectValidation,
    createProject
  );

router
  .route('/:id')
  .put(
    protect,
    authorize('admin'),
    cleanupOnError,
    upload.array('images', 10),
    handleMulterError,
    projectValidation,
    updateProject
  )
  .delete(protect, authorize('admin'), deleteProject);

// Public route for getting project by slug (must come last)
router.get('/:slug', getProject);

module.exports = router;