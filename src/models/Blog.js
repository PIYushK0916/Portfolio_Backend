const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [150, 'Title cannot be more than 150 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  featuredImage: {
    url: {
      type: String,
      required: [true, 'Featured image is required']
    },
    alt: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    }
  },
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    enum: [
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
    ]
  },
  tags: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isSticky: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  relatedPosts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Blog'
  }],
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot be more than 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot be more than 160 characters']
    },
    keywords: [{
      type: String,
      trim: true
    }],
    canonicalUrl: {
      type: String
    }
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  // Table of Contents (auto-generated from content headings)
  tableOfContents: [{
    level: {
      type: Number, // h1=1, h2=2, etc.
      required: true
    },
    title: {
      type: String,
      required: true
    },
    anchor: {
      type: String,
      required: true
    }
  }],
  // For series/multi-part blogs
  series: {
    name: String,
    part: Number,
    totalParts: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title
blogSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Ensure slug uniqueness
blogSchema.pre('save', async function(next) {
  if (this.isModified('slug') || this.isNew) {
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const blogsWithSlug = await this.constructor.find({ slug: slugRegEx });
    
    if (blogsWithSlug.length) {
      this.slug = `${this.slug}-${blogsWithSlug.length + 1}`;
    }
  }
  next();
});

// Auto-set publishedAt when status changes to published
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Auto-calculate read time based on content (assuming 200 words per minute)
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

// Auto-generate table of contents from content
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    const toc = [];
    let match;
    
    while ((match = headingRegex.exec(this.content)) !== null) {
      const level = parseInt(match[1]);
      const title = match[2].replace(/<[^>]*>/g, ''); // Strip HTML tags
      const anchor = slugify(title, { lower: true, strict: true });
      
      toc.push({ level, title, anchor });
    }
    
    this.tableOfContents = toc;
  }
  next();
});

// Virtual for formatted publish date
blogSchema.virtual('formattedPublishDate').get(function() {
  if (this.publishedAt) {
    return this.publishedAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return null;
});

// Virtual for category display name
blogSchema.virtual('categoryDisplay').get(function() {
  return this.category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
});

// Indexing for better performance
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ isFeatured: 1, isSticky: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ 'seo.keywords': 1 });

// Text index for search functionality
blogSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Blog', blogSchema);