const express = require('express');
const { body } = require('express-validator');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Get project stats
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          publishedProjects: {
            $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
          },
          featuredProjects: {
            $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
          }
        }
      }
    ]);

    // Get blog stats
    const blogStats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalBlogs: { $sum: 1 },
          publishedBlogs: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          draftBlogs: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' }
        }
      }
    ]);

    // Get user stats
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          adminUsers: {
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get recent activity
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title slug createdAt isPublished images')
      .populate('createdBy', 'name')
      .lean();

    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title slug createdAt status views featuredImage')
      .populate('author', 'name')
      .lean();

    res.status(200).json({
      status: 'success',
      data: {
        projects: projectStats[0] || {
          totalProjects: 0,
          publishedProjects: 0,
          featuredProjects: 0
        },
        blogs: blogStats[0] || {
          totalBlogs: 0,
          publishedBlogs: 0,
          draftBlogs: 0,
          totalViews: 0,
          totalLikes: 0
        },
        users: userStats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          adminUsers: 0
        },
        recentActivity: {
          projects: recentProjects,
          blogs: recentBlogs
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting dashboard statistics'
    });
  }
};

// @desc    Get all projects (Admin view)
// @route   GET /api/admin/projects
// @access  Private (Admin only)
const getAdminProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      status,
      category,
      published
    } = req.query;

    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (published !== undefined) query.isPublished = published === 'true';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const projects = await Project.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-longDescription -content')
      .lean();

    const total = await Project.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: projects.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      data: {
        projects
      }
    });
  } catch (error) {
    console.error('Get admin projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting projects'
    });
  }
};

// @desc    Get all blogs (Admin view)
// @route   GET /api/admin/blogs
// @access  Private (Admin only)
const getAdminBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      status,
      category,
      author
    } = req.query;

    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (author) query.author = author;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-content')
      .lean();

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      data: {
        blogs
      }
    });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting blogs'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      role,
      active
    } = req.query;

    let query = {};

    if (role) query.role = role;
    if (active !== undefined) query.isActive = active === 'true';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: users.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      data: {
        users
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting users'
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating user status'
    });
  }
};

// Routes
router.get('/dashboard', getDashboardStats);
router.get('/projects', getAdminProjects);
router.get('/blogs', getAdminBlogs);
router.get('/users', getUsers);
router.put('/users/:id/status', 
  [body('isActive').isBoolean().withMessage('isActive must be a boolean')],
  updateUserStatus
);

module.exports = router;