const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Blog = require('./src/models/Blog');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Sample Projects Data
const sampleProjects = [
    {
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce solution with payment integration and admin dashboard",
        longDescription: "A comprehensive e-commerce platform built with MERN stack featuring user authentication, product management, shopping cart, payment gateway integration with Stripe, order tracking, and admin dashboard. Implements real-time notifications and responsive design for seamless shopping experience.",
        category: "web",
        technologies: ["React", "Node.js", "MongoDB", "Express", "Redux", "Stripe", "JWT"],
        tags: ["ecommerce", "fullstack", "mern"],
        images: [{
            url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
            alt: "E-Commerce Platform Screenshot",
            isPrimary: true
        }],
        demoUrl: "https://ecommerce-demo.com",
        githubUrl: "https://github.com/yourusername/ecommerce-platform",
        isFeatured: true,
        status: "completed",
        year: 2024,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        teamSize: 1,
        myRole: "Full Stack Developer",
        challenges: [{
            title: "Payment Processing Security",
            description: "Implementing secure payment processing and managing complex state across multiple components",
            solution: "Used Redux for state management and implemented Stripe's secure payment APIs with proper error handling"
        }],
        features: [
            "User authentication and authorization",
            "Product catalog with search and filters",
            "Shopping cart with real-time updates",
            "Stripe payment integration",
            "Order tracking system",
            "Admin dashboard for management",
            "Real-time notifications"
        ],
        learnings: [
            "Advanced Redux state management",
            "Secure payment gateway integration",
            "Real-time WebSocket connections"
        ],
        metrics: {
            performance: "99.9% uptime",
            users: 5000
        }
    },
    {
        title: "Task Management App",
        description: "Collaborative task manager with real-time updates and team collaboration",
        longDescription: "A modern task management application with drag-and-drop interface, real-time collaboration using Socket.io, user roles and permissions, file attachments, comments, and activity tracking. Built with React and Node.js for seamless team productivity.",
        category: "web",
        technologies: ["React", "Node.js", "Socket.io", "MongoDB", "TailwindCSS", "Express"],
        tags: ["productivity", "collaboration", "realtime"],
        images: [{
            url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
            alt: "Task Management Dashboard",
            isPrimary: true
        }],
        demoUrl: "https://taskapp-demo.com",
        githubUrl: "https://github.com/yourusername/task-app",
        isFeatured: true,
        status: "completed",
        year: 2024,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-07-15'),
        teamSize: 2,
        myRole: "Lead Developer",
        challenges: [{
            title: "Real-time Synchronization",
            description: "Keeping multiple users' task boards synchronized in real-time",
            solution: "Implemented WebSocket connections with Socket.io and optimistic UI updates"
        }],
        features: [
            "Drag-and-drop task boards",
            "Real-time collaboration",
            "User roles and permissions",
            "File attachments",
            "Comments and mentions",
            "Activity tracking",
            "Email notifications"
        ],
        learnings: [
            "WebSocket programming",
            "Optimistic UI patterns",
            "Permission systems"
        ],
        metrics: {
            performance: "Real-time updates within 100ms",
            users: 2500
        }
    },
    {
        title: "AI ChatBot Interface",
        description: "Intelligent chatbot with natural language processing using OpenAI GPT",
        longDescription: "An AI-powered chatbot interface using OpenAI's GPT API, featuring context-aware conversations, message history, typing indicators, markdown support, and voice input/output. Includes admin panel for training and monitoring conversations.",
        category: "ai/ml",
        technologies: ["React", "OpenAI API", "Python", "FastAPI", "PostgreSQL", "WebSockets"],
        tags: ["ai", "chatbot", "nlp", "gpt"],
        images: [{
            url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800",
            alt: "AI Chatbot Interface",
            isPrimary: true
        }],
        demoUrl: "https://chatbot-demo.com",
        githubUrl: "https://github.com/yourusername/ai-chatbot",
        isFeatured: true,
        status: "in-progress",
        year: 2024,
        startDate: new Date('2024-08-01'),
        teamSize: 3,
        myRole: "AI Integration Lead",
        challenges: [{
            title: "Context Management",
            description: "Maintaining conversation context across multiple messages",
            solution: "Implemented a sliding window approach with token management"
        }],
        features: [
            "Context-aware conversations",
            "Message history and search",
            "Typing indicators",
            "Markdown formatting",
            "Voice input and output",
            "Admin monitoring panel",
            "Conversation analytics"
        ],
        learnings: [
            "OpenAI API integration",
            "Token management strategies",
            "Voice processing"
        ],
        metrics: {
            performance: "Sub-second response times",
            users: 10000
        }
    },
    {
        title: "Portfolio Website",
        description: "Modern portfolio with smooth animations and dynamic content management",
        longDescription: "A stunning portfolio website featuring smooth scroll animations with Locomotive Scroll, GSAP animations, responsive design, dark mode, contact form with email integration, and CMS for easy content management.",
        category: "web",
        technologies: ["React", "GSAP", "TailwindCSS", "Framer Motion", "Node.js"],
        tags: ["portfolio", "animation", "frontend"],
        images: [{
            url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            alt: "Portfolio Website Design",
            isPrimary: true
        }],
        demoUrl: "https://portfolio-demo.com",
        githubUrl: "https://github.com/yourusername/portfolio",
        isFeatured: false,
        status: "completed",
        year: 2024,
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-03-20'),
        teamSize: 1,
        myRole: "Full Stack Developer",
        challenges: [{
            title: "Smooth Animations Performance",
            description: "Maintaining 60fps animations while handling complex scroll effects",
            solution: "Used GSAP's timeline feature and optimized render cycles"
        }],
        features: [
            "Smooth scroll with Locomotive Scroll",
            "GSAP animations",
            "Responsive design",
            "Dark mode toggle",
            "Contact form integration",
            "CMS backend",
            "SEO optimized"
        ],
        learnings: [
            "Advanced animation techniques",
            "Performance optimization",
            "Scroll-driven animations"
        ],
        metrics: {
            performance: "100 Lighthouse score",
            users: 1000
        }
    },
    {
        title: "Weather Dashboard",
        description: "Real-time weather tracking application with PWA capabilities",
        longDescription: "Interactive weather dashboard with real-time data from OpenWeather API, location-based forecasts, weather alerts, historical data visualization, and PWA capabilities for offline access.",
        category: "mobile",
        technologies: ["React", "OpenWeather API", "Chart.js", "PWA", "Service Workers"],
        tags: ["pwa", "weather", "mobile"],
        images: [{
            url: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800",
            alt: "Weather Dashboard Interface",
            isPrimary: true
        }],
        demoUrl: "https://weather-dashboard-demo.com",
        githubUrl: "https://github.com/yourusername/weather-dashboard",
        isFeatured: false,
        status: "completed",
        year: 2024,
        startDate: new Date('2024-04-05'),
        endDate: new Date('2024-05-10'),
        teamSize: 1,
        myRole: "Frontend Developer",
        challenges: [{
            title: "Offline Functionality",
            description: "Providing useful weather data even when offline",
            solution: "Implemented service workers with smart caching strategies"
        }],
        features: [
            "Real-time weather data",
            "Location-based forecasts",
            "Weather alerts and notifications",
            "Historical data charts",
            "PWA with offline support",
            "Multi-location tracking",
            "Responsive design"
        ],
        learnings: [
            "PWA development",
            "Service worker strategies",
            "Data visualization with Chart.js"
        ],
        metrics: {
            performance: "Lighthouse PWA score: 95",
            users: 3000
        }
    }
];

// Sample Blog Posts Data
const sampleBlogs = [
    {
        title: "Building Scalable React Applications: Best Practices for 2024",
        slug: "building-scalable-react-applications-2024",
        excerpt: "Learn the essential patterns and practices for building maintainable and scalable React applications that can grow with your team.",
        content: `
# Building Scalable React Applications: Best Practices for 2024

React has evolved significantly over the years, and building scalable applications requires understanding modern patterns and best practices. In this comprehensive guide, we'll explore the key principles that will help you build better React applications.

## 1. Component Architecture

### Atomic Design Pattern
Breaking down your UI into atoms, molecules, organisms, templates, and pages helps maintain consistency and reusability.

\`\`\`javascript
// Atom: Button component
const Button = ({ children, onClick, variant = 'primary' }) => (
  <button className={\`btn btn-\${variant}\`} onClick={onClick}>
    {children}
  </button>
);
\`\`\`

### Container/Presentational Pattern
Separate your business logic from presentation to improve testability and reusability.

## 2. State Management

Choose the right state management solution based on your app's complexity:
- **Local State**: Use useState for component-specific state
- **Context API**: For app-wide state that doesn't change frequently
- **Redux/Zustand**: For complex applications with intricate state interactions

## 3. Performance Optimization

- Use React.memo() for expensive components
- Implement code splitting with React.lazy()
- Optimize re-renders with useMemo and useCallback
- Virtual scrolling for long lists

## 4. Testing Strategy

A comprehensive testing strategy includes:
- Unit tests for individual components
- Integration tests for component interactions
- E2E tests for critical user flows

## Conclusion

Building scalable React applications is about making informed architectural decisions early and maintaining consistency throughout development. Start with these practices and adapt them to your team's needs.
        `,
        category: "web-development",
        tags: ["react", "javascript", "best-practices", "architecture", "performance"],
        featuredImage: {
            url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
            alt: "React Development"
        },
        author: null, // Will be set to admin user
        readTime: 8,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2024-10-15'),
        views: 3421,
        likes: 287,
        seo: {
            metaTitle: "Building Scalable React Applications | Best Practices 2024",
            metaDescription: "Learn essential patterns for building maintainable React applications",
            keywords: ["React", "scalability", "best practices", "architecture"]
        }
    },
    {
        title: "Understanding Node.js Event Loop: A Deep Dive",
        excerpt: "Explore how Node.js handles asynchronous operations through its event loop and why it makes Node.js so efficient for I/O operations.",
        content: `
# Understanding Node.js Event Loop: A Deep Dive

The event loop is the heart of Node.js's asynchronous nature. Understanding how it works is crucial for writing efficient Node.js applications.

## What is the Event Loop?

The event loop is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.

## Phases of Event Loop

1. **Timers**: Executes callbacks scheduled by setTimeout() and setInterval()
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration
3. **Idle, Prepare**: Internal use only
4. **Poll**: Retrieves new I/O events
5. **Check**: setImmediate() callbacks execute here
6. **Close Callbacks**: Socket.on('close') type callbacks

## Code Example

\`\`\`javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');

// Output: Start, End, Promise, Timeout
\`\`\`

## Best Practices

- Don't block the event loop with synchronous operations
- Use worker threads for CPU-intensive tasks
- Understand microtasks vs macrotasks

Understanding the event loop helps you write more efficient and predictable Node.js applications.
        `,
        category: "tutorials",
        tags: ["nodejs", "javascript", "event-loop", "async", "performance"],
        featuredImage: {
            url: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
            alt: "Node.js Development"
        },
        author: null,
        readTime: 12,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2024-10-20'),
        views: 2876,
        likes: 234,
        seo: {
            metaTitle: "Node.js Event Loop Explained | Complete Guide",
            metaDescription: "Deep dive into Node.js event loop and asynchronous operations",
            keywords: ["Node.js", "event loop", "async", "backend"]
        }
    },
    {
        title: "Modern CSS: Grid vs Flexbox - When to Use What",
        slug: "css-grid-vs-flexbox",
        excerpt: "Understanding the differences between CSS Grid and Flexbox, and knowing when to use each layout system for optimal results.",
        content: `
# Modern CSS: Grid vs Flexbox - When to Use What

Both CSS Grid and Flexbox are powerful layout systems, but they excel in different scenarios. Let's explore when to use each.

## Flexbox: The One-Dimensional Layout

Flexbox is perfect for:
- Navigation menus
- Card layouts
- Centering content
- Distributing space along a single axis

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## CSS Grid: The Two-Dimensional Layout

Grid excels at:
- Page layouts
- Complex 2D layouts
- Creating magazine-style designs
- Grid-based image galleries

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
\`\`\`

## When to Use What?

- **Use Flexbox** when you need to align items in a single direction
- **Use Grid** when you need to control layout in both directions
- **Use Both** for complex layouts (Grid for overall structure, Flexbox for components)

## Conclusion

Both tools have their place in modern web development. Understanding their strengths helps you choose the right tool for the job.
        `,
        category: "web-development",
        tags: ["css", "flexbox", "grid", "layout", "frontend"],
        featuredImage: {
            url: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
            alt: "CSS Layout Design"
        },
        author: null,
        readTime: 6,
        isFeatured: false,
        isPublished: true,
        publishedAt: new Date('2024-10-25'),
        views: 1543,
        likes: 123,
        seo: {
            metaTitle: "CSS Grid vs Flexbox: Complete Comparison Guide",
            metaDescription: "Learn when to use CSS Grid vs Flexbox for optimal layouts",
            keywords: ["CSS", "Grid", "Flexbox", "layout"]
        }
    },
    {
        title: "Introduction to Machine Learning with Python",
        slug: "intro-machine-learning-python",
        excerpt: "Get started with machine learning using Python. Learn the basics of ML algorithms and how to implement them with scikit-learn.",
        content: `
# Introduction to Machine Learning with Python

Machine Learning is transforming how we build applications. Let's explore the basics and build your first ML model.

## What is Machine Learning?

Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.

## Types of Machine Learning

1. **Supervised Learning**: Learning from labeled data
2. **Unsupervised Learning**: Finding patterns in unlabeled data
3. **Reinforcement Learning**: Learning through rewards and penalties

## Your First ML Model

\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import numpy as np

# Sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
\`\`\`

## Popular ML Libraries

- **scikit-learn**: General purpose ML
- **TensorFlow**: Deep learning
- **PyTorch**: Deep learning research
- **Pandas**: Data manipulation

## Next Steps

Start with simple projects like:
- House price prediction
- Spam email classification
- Customer segmentation

Machine Learning is a journey. Start small and gradually tackle more complex problems.
        `,
        category: "ai-ml",
        tags: ["machine-learning", "python", "ai", "data-science", "scikit-learn"],
        featuredImage: {
            url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
            alt: "Machine Learning Concept"
        },
        author: null,
        readTime: 10,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2024-11-01'),
        views: 4123,
        likes: 345,
        seo: {
            metaTitle: "Machine Learning with Python for Beginners",
            metaDescription: "Start your ML journey with Python and scikit-learn",
            keywords: ["machine learning", "Python", "AI", "tutorial"]
        }
    }
];

// Seed function
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Project.deleteMany({});
        await Blog.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create admin user
        console.log('👤 Creating admin user...');
        const adminUser = await User.create({
            name: 'Piyush Katole',
            email: 'admin@piyushkatole.com',
            password: 'admin123456', // Let the model hash it
            role: 'admin',
            bio: 'Full Stack Developer & Tech Enthusiast',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            social: {
                github: 'https://github.com/PIYushK0916',
                linkedin: 'https://linkedin.com/in/piyushkatole',
                twitter: 'https://twitter.com/piyushkatole'
            }
        });
        console.log(`✅ Admin user created: ${adminUser.email}\n`);

        // Create projects
        console.log('📁 Creating sample projects...');
        const projects = [];
        for (const projectData of sampleProjects) {
            const project = new Project({
                ...projectData,
                createdBy: adminUser._id
            });
            await project.save();
            projects.push(project);
            console.log(`   ✓ Created: ${project.title}`);
        }
        console.log(`✅ ${projects.length} projects created\n`);

        // Create blogs with author reference
        console.log('📝 Creating sample blog posts...');
        const blogs = [];
        for (const blogData of sampleBlogs) {
            const blog = new Blog({
                ...blogData,
                author: adminUser._id
            });
            await blog.save();
            blogs.push(blog);
            console.log(`   ✓ Created: ${blog.title}`);
        }
        console.log(`✅ ${blogs.length} blog posts created\n`);

        // Summary
        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   • Admin User: ${adminUser.email}`);
        console.log(`   • Password: admin123456`);
        console.log(`   • Projects: ${projects.length}`);
        console.log(`   • Blog Posts: ${blogs.length}\n`);

        console.log('🔑 Admin Login Credentials:');
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Password: admin123456\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run seeder
seedDatabase();
