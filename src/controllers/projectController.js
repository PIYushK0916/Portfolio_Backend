const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const { deleteFile } = require('../middleware/upload');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const {
      category,
      status,
      featured,
      published,
      search,
      tags,
      technologies,
      year,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query object
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by featured
    if (featured !== undefined) {
      query.isFeatured = featured === 'true';
    }

    // Filter by published (only show published projects for public)
    if (published !== undefined) {
      query.isPublished = published === 'true';
    } else {
      // Default to published only for public access
      query.isPublished = true;
    }

    // Filter by year
    if (year) {
      query.year = parseInt(year);
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    // Filter by technologies
    if (technologies) {
      const techArray = technologies.split(',').map(tech => tech.trim());
      query.technologies = { $in: techArray };
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { longDescription: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Execute query with pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const projects = await Project.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
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
    console.error('Get projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting projects'
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:slug OR GET /api/projects/admin/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const { slug, id } = req.params;
    const identifier = id || slug;

    let project;

    // Check if it's a MongoDB ObjectId (for admin edit)
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // Fetch by ID (admin access - no published filter)
      project = await Project.findById(identifier).populate('createdBy', 'name email avatar');
    } else {
      // Fetch by slug (public access - only published)
      project = await Project.findOne({ 
        slug: identifier, 
        isPublished: true 
      }).populate('createdBy', 'name email avatar');
    }

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting project'
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin only)
const createProject = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: req.body[`imageAlt${index}`] || '',
        caption: req.body[`imageCaption${index}`] || '',
        isPrimary: index === 0 // First image is primary by default
      }));
    }

    // Create project
    const projectData = {
      ...req.body,
      images,
      createdBy: req.user._id
    };

    // Parse arrays if they're strings
    if (typeof projectData.technologies === 'string') {
      projectData.technologies = projectData.technologies.split(',').map(tech => tech.trim());
    }
    if (typeof projectData.tags === 'string') {
      projectData.tags = projectData.tags.split(',').map(tag => tag.trim().toLowerCase());
    }
    if (typeof projectData.features === 'string') {
      projectData.features = projectData.features.split(',').map(feature => feature.trim());
    }
    if (typeof projectData.learnings === 'string') {
      projectData.learnings = projectData.learnings.split(',').map(learning => learning.trim());
    }
    
    // Parse complex objects if they're JSON strings
    if (typeof projectData.challenges === 'string') {
      try {
        projectData.challenges = JSON.parse(projectData.challenges);
      } catch (e) {
        projectData.challenges = [];
      }
    }
    if (typeof projectData.metrics === 'string') {
      try {
        projectData.metrics = JSON.parse(projectData.metrics);
      } catch (e) {
        projectData.metrics = { performance: '', users: '', other: [] };
      }
    }
    if (typeof projectData.seo === 'string') {
      try {
        projectData.seo = JSON.parse(projectData.seo);
      } catch (e) {
        projectData.seo = { metaTitle: '', metaDescription: '', keywords: [] };
      }
    }

    const project = await Project.create(projectData);

    await project.populate('createdBy', 'name email');

    res.status(201).json({
      status: 'success',
      message: 'Project created successfully',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating project'
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
const updateProject = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;

    let project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    // Process uploaded images
    let images = [...project.images]; // Keep existing images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: req.body[`imageAlt${index}`] || '',
        caption: req.body[`imageCaption${index}`] || '',
        isPrimary: false
      }));
      images = [...images, ...newImages];
    }

    // Parse arrays if they're strings
    const updateData = { ...req.body };
    if (typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(tech => tech.trim());
    }
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim().toLowerCase());
    }
    if (typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map(feature => feature.trim());
    }
    if (typeof updateData.learnings === 'string') {
      updateData.learnings = updateData.learnings.split(',').map(learning => learning.trim());
    }
    
    // Parse complex objects if they're JSON strings
    if (typeof updateData.challenges === 'string') {
      try {
        updateData.challenges = JSON.parse(updateData.challenges);
      } catch (e) {
        console.error('Error parsing challenges:', e);
        updateData.challenges = [];
      }
    }
    if (typeof updateData.metrics === 'string') {
      try {
        updateData.metrics = JSON.parse(updateData.metrics);
      } catch (e) {
        console.error('Error parsing metrics:', e);
        updateData.metrics = { performance: '', users: '', other: [] };
      }
    }
    if (typeof updateData.seo === 'string') {
      try {
        updateData.seo = JSON.parse(updateData.seo);
      } catch (e) {
        console.error('Error parsing seo:', e);
        updateData.seo = { metaTitle: '', metaDescription: '', keywords: [] };
      }
    }

    updateData.images = images;

    project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email');

    res.status(200).json({
      status: 'success',
      message: 'Project updated successfully',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating project'
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    // Delete associated images
    project.images.forEach(image => {
      const imagePath = `uploads${image.url}`;
      deleteFile(imagePath);
    });

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting project'
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private (Admin only)
const getProjectStats = async (req, res) => {
  try {
    const stats = await Project.aggregate([
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

    const categoryStats = await Project.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const yearStats = await Project.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overview: stats[0] || {
          totalProjects: 0,
          publishedProjects: 0,
          featuredProjects: 0
        },
        categoryStats,
        yearStats
      }
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting project statistics'
    });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats
};