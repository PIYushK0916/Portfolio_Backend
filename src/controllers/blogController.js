const { validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const { deleteFile } = require('../middleware/upload');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const {
      category,
      status,
      featured,
      search,
      tags,
      author,
      page = 1,
      limit = 10,
      sort = '-publishedAt'
    } = req.query;

    // Build query object
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status (only show published for public)
    if (status && req.user && req.user.role === 'admin') {
      query.status = status;
    } else {
      query.status = 'published';
    }

    // Filter by featured
    if (featured !== undefined) {
      query.isFeatured = featured === 'true';
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let sortOption = {};
    
    // Handle different sort options
    switch (sort) {
      case 'oldest':
        sortOption = { publishedAt: 1 };
        break;
      case 'popular':
        sortOption = { views: -1, likes: -1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      default:
        sortOption = { publishedAt: -1 }; // newest first
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar')
      .populate('relatedPosts', 'title slug featuredImage excerpt')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
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
    console.error('Get blogs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting blogs'
    });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:slug
// @access  Public
const getBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ 
      slug, 
      status: 'published' 
    })
      .populate('author', 'name email avatar bio')
      .populate('relatedPosts', 'title slug featuredImage excerpt category publishedAt');

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        blog
      }
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting blog post'
    });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private (Admin only)
const createBlog = async (req, res) => {
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

    // Process featured image
    let featuredImage = {};
    if (req.file) {
      featuredImage = {
        url: `/uploads/${req.file.filename}`,
        alt: req.body.featuredImageAlt || '',
        caption: req.body.featuredImageCaption || ''
      };
    }

    // Create blog
    const blogData = {
      ...req.body,
      featuredImage,
      author: req.user._id
    };

    // Parse arrays if they're strings
    if (typeof blogData.tags === 'string') {
      blogData.tags = blogData.tags.split(',').map(tag => tag.trim().toLowerCase());
    }

    const blog = await Blog.create(blogData);

    await blog.populate('author', 'name email avatar');

    res.status(201).json({
      status: 'success',
      message: 'Blog post created successfully',
      data: {
        blog
      }
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating blog post'
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin only)
const updateBlog = async (req, res) => {
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

    let blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    const updateData = { ...req.body };

    // Process new featured image if uploaded
    if (req.file) {
      // Delete old featured image if exists
      if (blog.featuredImage && blog.featuredImage.url) {
        const oldImagePath = `uploads${blog.featuredImage.url}`;
        deleteFile(oldImagePath);
      }

      updateData.featuredImage = {
        url: `/uploads/${req.file.filename}`,
        alt: req.body.featuredImageAlt || '',
        caption: req.body.featuredImageCaption || ''
      };
    }

    // Parse arrays if they're strings
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim().toLowerCase());
    }

    blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('author', 'name email avatar');

    res.status(200).json({
      status: 'success',
      message: 'Blog post updated successfully',
      data: {
        blog
      }
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating blog post'
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin only)
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    // Delete featured image
    if (blog.featuredImage && blog.featuredImage.url) {
      const imagePath = `uploads${blog.featuredImage.url}`;
      deleteFile(imagePath);
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting blog post'
    });
  }
};

// @desc    Like/Unlike blog
// @route   POST /api/blogs/:id/like
// @access  Public
const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    blog.likes += 1;
    await blog.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Blog post liked',
      data: {
        likes: blog.likes
      }
    });
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error liking blog post'
    });
  }
};

// @desc    Get blog categories
// @route   GET /api/blogs/categories
// @access  Public
const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Blog.countDocuments({ 
          category, 
          status: 'published' 
        });
        return {
          name: category,
          displayName: category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          count
        };
      })
    );

    res.status(200).json({
      status: 'success',
      data: {
        categories: categoriesWithCount.sort((a, b) => b.count - a.count)
      }
    });
  } catch (error) {
    console.error('Get blog categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting blog categories'
    });
  }
};

// @desc    Get popular tags
// @route   GET /api/blogs/tags
// @access  Public
const getPopularTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        tags
      }
    });
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting popular tags'
    });
  }
};

// @desc    Get blog statistics
// @route   GET /api/blogs/stats
// @access  Private (Admin only)
const getBlogStats = async (req, res) => {
  try {
    const stats = await Blog.aggregate([
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
          totalLikes: { $sum: '$likes' },
          avgReadTime: { $avg: '$readTime' }
        }
      }
    ]);

    const categoryStats = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const monthlyStats = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: {
            year: { $year: '$publishedAt' },
            month: { $month: '$publishedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overview: stats[0] || {
          totalBlogs: 0,
          publishedBlogs: 0,
          draftBlogs: 0,
          totalViews: 0,
          totalLikes: 0,
          avgReadTime: 0
        },
        categoryStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting blog statistics'
    });
  }
};

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  getBlogCategories,
  getPopularTags,
  getBlogStats
};