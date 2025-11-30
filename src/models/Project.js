const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  longDescription: {
    type: String,
    maxlength: [2000, 'Long description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: ['web', 'mobile', 'desktop', 'ai/ml', 'data-science', 'other'],
    default: 'web'
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'],
    default: 'completed'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  technologies: [{
    type: String,
    required: true,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  demoUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Demo URL must be a valid URL'
    }
  },
  githubUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/(www\.)?github\.com\/.+/.test(v);
      },
      message: 'GitHub URL must be a valid GitHub repository URL'
    }
  },
  year: {
    type: Number,
    required: [true, 'Project year is required'],
    min: [2020, 'Year cannot be before 2020'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  teamSize: {
    type: Number,
    min: [1, 'Team size must be at least 1'],
    default: 1
  },
  myRole: {
    type: String,
    trim: true,
    maxlength: [100, 'Role cannot be more than 100 characters']
  },
  challenges: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    solution: {
      type: String
    }
  }],
  features: [{
    type: String,
    required: true,
    trim: true
  }],
  learnings: [{
    type: String,
    trim: true
  }],
  metrics: {
    performance: {
      type: String
    },
    users: {
      type: Number
    },
    other: [{
      metric: String,
      value: String
    }]
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
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
    }]
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title
projectSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Ensure slug uniqueness
projectSchema.pre('save', async function(next) {
  if (this.isModified('slug') || this.isNew) {
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const projectsWithSlug = await this.constructor.find({ slug: slugRegEx });
    
    if (projectsWithSlug.length) {
      this.slug = `${this.slug}-${projectsWithSlug.length + 1}`;
    }
  }
  next();
});

// Virtual for primary image
projectSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Virtual for duration
projectSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Indexing for better performance
projectSchema.index({ slug: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ technologies: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ isPublished: 1, isFeatured: 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);