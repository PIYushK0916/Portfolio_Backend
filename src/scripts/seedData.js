const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Project = require('../models/Project');
const Blog = require('../models/Blog');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/piyush-portfolio');
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Blog.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Piyush Katole',
      email: process.env.ADMIN_EMAIL || 'admin@piyushkatole.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
      bio: 'Full Stack Developer and AI/ML Enthusiast',
      isActive: true
    });

    console.log('👤 Created admin user');

    // Sample projects data (based on your existing projects)
    const projectsData = [
      {
        title: "Portfolio Website",
        description: "A personal developer portfolio showcasing skills, projects, and animations.",
        longDescription: "A comprehensive portfolio website built with React, featuring smooth animations with Framer Motion and GSAP. The site includes project showcases, skill demonstrations, and interactive elements designed to provide an engaging user experience.",
        category: "web",
        status: "completed",
        technologies: ["React", "Framer Motion", "GSAP", "TailwindCSS", "Vercel"],
        tags: ["portfolio", "react", "animation", "responsive"],
        images: [
          {
            url: "/portfolio.png",
            alt: "Portfolio Website Screenshot",
            isPrimary: true
          }
        ],
        demoUrl: "https://piyushkatole.com",
        githubUrl: "https://github.com/PIYushK0916/portfolio",
        year: 2024,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-01'),
        teamSize: 1,
        myRole: "Full Stack Developer",
        features: [
          "Responsive design",
          "Smooth animations",
          "Project showcase",
          "Contact form",
          "Dark theme"
        ],
        challenges: [
          {
            title: "Performance Optimization",
            description: "Initial load times were slow due to heavy animations",
            solution: "Implemented lazy loading and optimized asset delivery"
          }
        ],
        learnings: [
          "Advanced React patterns",
          "Animation optimization techniques",
          "Performance monitoring"
        ],
        metrics: {
          performance: "95+ Lighthouse score",
          users: 1000
        },
        isPublished: true,
        isFeatured: true,
        order: 1,
        createdBy: adminUser._id
      },
      {
        title: "KhataBook",
        description: "A MERN stack-based ledger app enabling small businesses to manage finances digitally.",
        longDescription: "A comprehensive financial management system for small businesses, built with the MERN stack. Features include transaction tracking, customer management, invoice generation, and detailed financial reporting.",
        category: "web",
        status: "completed",
        technologies: ["MongoDB", "Express", "React", "Node.js", "Multer"],
        tags: ["fintech", "mern", "business", "finance"],
        images: [
          {
            url: "/Khatabook.png",
            alt: "KhataBook Application Screenshot",
            isPrimary: true
          }
        ],
        githubUrl: "https://github.com/PIYushK0916/khatabook",
        year: 2024,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-01'),
        teamSize: 1,
        myRole: "Full Stack Developer",
        features: [
          "Transaction management",
          "Customer ledger",
          "File upload functionality",
          "Reporting dashboard",
          "Data export"
        ],
        challenges: [
          {
            title: "Data Security",
            description: "Ensuring financial data is properly secured",
            solution: "Implemented JWT authentication and data encryption"
          }
        ],
        learnings: [
          "Financial application architecture",
          "Data security best practices",
          "File handling in Node.js"
        ],
        isPublished: true,
        isFeatured: true,
        order: 2,
        createdBy: adminUser._id
      },
      {
        title: "Cancer Detection (EpiScan)",
        description: "Machine learning model for early cancer detection using data modeling techniques.",
        longDescription: "An AI-powered system for early cancer detection using machine learning algorithms. The system analyzes medical data patterns to predict potential cancer risks with high accuracy.",
        category: "ai/ml",
        status: "completed",
        technologies: ["Python", "scikit-learn", "Pandas", "NumPy", "Matplotlib"],
        tags: ["ai", "ml", "healthcare", "data-science"],
        images: [
          {
            url: "/Skio Sio.png",
            alt: "EpiScan Cancer Detection Interface",
            isPrimary: true
          }
        ],
        year: 2024,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-01'),
        teamSize: 1,
        myRole: "ML Engineer",
        features: [
          "Data preprocessing",
          "Feature selection",
          "Model training",
          "Prediction interface",
          "Accuracy reporting"
        ],
        challenges: [
          {
            title: "Data Quality",
            description: "Inconsistent medical data formats",
            solution: "Implemented robust data cleaning and normalization pipeline"
          }
        ],
        learnings: [
          "Medical data analysis",
          "Machine learning model optimization",
          "Healthcare domain knowledge"
        ],
        metrics: {
          performance: "94% prediction accuracy"
        },
        isPublished: true,
        isFeatured: true,
        order: 3,
        createdBy: adminUser._id
      }
    ];

    // Create projects
    const projects = await Project.insertMany(projectsData);
    console.log(`📁 Created ${projects.length} projects`);

    // Sample blog posts
    const blogsData = [
      {
        title: "Getting Started with React and Modern JavaScript",
        slug: "getting-started-react-modern-javascript",
        excerpt: "Learn the fundamentals of React and modern JavaScript features that every developer should know in 2024.",
        content: `
# Getting Started with React and Modern JavaScript

React has become one of the most popular frontend frameworks, and for good reason. Combined with modern JavaScript features, it provides a powerful platform for building interactive user interfaces.

## Why React?

React offers several advantages:
- **Component-based architecture**: Build encapsulated components that manage their own state
- **Virtual DOM**: Efficient updates and rendering
- **Strong ecosystem**: Vast library of third-party packages
- **Developer tools**: Excellent debugging and development experience

## Modern JavaScript Features

### Arrow Functions
Arrow functions provide a concise way to write functions:

\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
\`\`\`

### Destructuring
Extract values from arrays and objects:

\`\`\`javascript
const user = { name: 'John', age: 30 };
const { name, age } = user;

const numbers = [1, 2, 3];
const [first, second] = numbers;
\`\`\`

### Template Literals
Create strings with embedded expressions:

\`\`\`javascript
const name = 'World';
const greeting = \`Hello, \${name}!\`;
\`\`\`

## React Fundamentals

### Components
Components are the building blocks of React applications:

\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

### State and Props
- **Props**: Data passed from parent to child components
- **State**: Internal component data that can change over time

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## Getting Started

1. **Create a new React app**:
   \`\`\`bash
   npx create-react-app my-app
   cd my-app
   npm start
   \`\`\`

2. **Or use Vite for faster development**:
   \`\`\`bash
   npm create vite@latest my-app -- --template react
   cd my-app
   npm install
   npm run dev
   \`\`\`

## Best Practices

- Keep components small and focused
- Use meaningful names for components and variables
- Implement proper error handling
- Write tests for your components
- Follow React's official style guide

## Conclusion

React and modern JavaScript provide a solid foundation for building modern web applications. Start with small projects and gradually work your way up to more complex applications. The key is consistent practice and staying updated with the latest best practices.

Happy coding! 🚀
        `,
        featuredImage: {
          url: "/blog-react-js.jpg",
          alt: "React and JavaScript code on screen"
        },
        category: "web-development",
        tags: ["react", "javascript", "frontend", "tutorial"],
        status: "published",
        publishedAt: new Date('2024-01-15'),
        isSticky: false,
        isFeatured: true,
        author: adminUser._id
      },
      {
        title: "Machine Learning for Beginners: A Practical Guide",
        slug: "machine-learning-beginners-practical-guide",
        excerpt: "Dive into the world of machine learning with practical examples and real-world applications. Perfect for beginners looking to get started.",
        content: `
# Machine Learning for Beginners: A Practical Guide

Machine Learning (ML) might seem intimidating at first, but it's more accessible than you think. This guide will walk you through the basics with practical examples.

## What is Machine Learning?

Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.

## Types of Machine Learning

### 1. Supervised Learning
Learn from labeled examples:
- **Classification**: Categorizing data (email spam detection)
- **Regression**: Predicting numerical values (house prices)

### 2. Unsupervised Learning
Find patterns in unlabeled data:
- **Clustering**: Grouping similar items
- **Association**: Finding relationships between variables

### 3. Reinforcement Learning
Learn through trial and error with rewards and penalties.

## Getting Started with Python

Python is the most popular language for ML. Here's a simple example:

\`\`\`python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# Load data
data = pd.read_csv('house_prices.csv')

# Prepare features and target
X = data[['bedrooms', 'bathrooms', 'square_feet']]
y = data['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, predictions)
print(f'Mean Squared Error: {mse}')
\`\`\`

## Essential Libraries

- **NumPy**: Numerical computing
- **Pandas**: Data manipulation
- **Scikit-learn**: Machine learning algorithms
- **Matplotlib**: Data visualization
- **TensorFlow/PyTorch**: Deep learning

## Common ML Workflow

1. **Data Collection**: Gather relevant data
2. **Data Cleaning**: Remove inconsistencies
3. **Exploratory Data Analysis**: Understand your data
4. **Feature Engineering**: Create relevant features
5. **Model Selection**: Choose appropriate algorithm
6. **Training**: Teach the model
7. **Evaluation**: Test model performance
8. **Deployment**: Put model into production

## Tips for Success

- Start with simple projects
- Focus on understanding the data
- Don't skip data cleaning
- Validate your models properly
- Keep learning and experimenting

## Conclusion

Machine learning is a powerful tool that's becoming increasingly important in our digital world. Start with simple projects, be patient with yourself, and remember that even experts started as beginners.

The key is to start coding and experimenting with real data. Good luck on your ML journey! 🤖
        `,
        featuredImage: {
          url: "/blog-ml-guide.jpg",
          alt: "Machine learning algorithms visualization"
        },
        category: "ai-ml",
        tags: ["machine-learning", "ai", "python", "data-science", "beginner"],
        status: "published",
        publishedAt: new Date('2024-02-01'),
        isSticky: false,
        isFeatured: true,
        author: adminUser._id
      },
      {
        title: "My Journey in Full Stack Development",
        slug: "my-journey-full-stack-development",
        excerpt: "A personal reflection on my path to becoming a full stack developer, the challenges faced, and lessons learned along the way.",
        content: `
# My Journey in Full Stack Development

When I started my programming journey, I had no idea where it would take me. Today, I want to share my experience becoming a full stack developer and the lessons I've learned along the way.

## The Beginning

It all started with curiosity. I was fascinated by how websites worked and wanted to understand the magic behind the interfaces I used every day. My first line of code was probably a simple "Hello, World!" in C during my college days.

## Learning the Fundamentals

### HTML, CSS, and JavaScript
Like many developers, I started with the web trinity:
- **HTML**: Understanding structure and semantics
- **CSS**: Making things look beautiful and responsive
- **JavaScript**: Adding interactivity and logic

The early days were tough. CSS layouts seemed like black magic, and JavaScript's quirks were confusing. But persistence paid off.

### Backend Development
Moving to the backend opened up a whole new world:
- **Node.js**: JavaScript on the server-side
- **Databases**: Understanding how data flows
- **APIs**: Connecting frontend and backend

## Key Projects That Shaped Me

### 1. First Portfolio Website
Building my first portfolio taught me:
- Responsive design principles
- Performance optimization
- User experience considerations

### 2. E-commerce Application
This project introduced me to:
- Complex state management
- Payment integrations
- Security considerations

### 3. Data Analytics Dashboard
Working with data visualization helped me understand:
- Data processing and analysis
- Chart libraries and visualization techniques
- Backend optimization for large datasets

## Challenges and How I Overcame Them

### Imposter Syndrome
Every developer faces this. I overcame it by:
- Focusing on continuous learning
- Contributing to open source projects
- Connecting with the developer community

### Technology Overwhelm
The JavaScript ecosystem moves fast. My approach:
- Focus on fundamentals first
- Learn new tools when there's a real need
- Don't chase every new framework

### Debugging Complex Issues
Some bugs kept me up at night. I learned to:
- Use proper debugging tools
- Write better tests
- Ask for help when stuck

## What I Wish I Knew Earlier

1. **Code quality matters more than quantity**
2. **Understanding the problem is half the solution**
3. **Documentation is not optional**
4. **Testing saves time in the long run**
5. **Communication skills are as important as coding skills**

## Current Tech Stack

After years of experimentation, my go-to stack is:

**Frontend:**
- React with TypeScript
- TailwindCSS for styling
- Framer Motion for animations

**Backend:**
- Node.js with Express
- MongoDB/PostgreSQL
- JWT for authentication

**DevOps:**
- Docker for containerization
- AWS for deployment
- GitHub Actions for CI/CD

## Advice for Aspiring Developers

### 1. Start Building Early
Don't wait until you feel "ready." Start building projects as soon as you know the basics.

### 2. Join Communities
The developer community is incredibly supportive. Join Discord servers, attend meetups, contribute to discussions.

### 3. Learn in Public
Share your learning journey. Write blog posts, create tutorials, or just tweet about what you're learning.

### 4. Focus on Problem-Solving
Technology changes, but problem-solving skills remain valuable. Focus on understanding problems deeply.

### 5. Be Patient
Development skills take time to build. Don't get discouraged by the learning curve.

## What's Next?

I'm currently exploring:
- Machine learning and AI integration
- Cloud-native architectures
- Web3 and blockchain technologies

The learning never stops, and that's what I love about this field.

## Conclusion

My journey in full stack development has been challenging but incredibly rewarding. Every project taught me something new, every bug made me a better debugger, and every success motivated me to keep going.

If you're just starting or somewhere in the middle of your journey, remember that every expert was once a beginner. Keep coding, keep learning, and most importantly, enjoy the process!

Feel free to reach out if you have any questions or want to share your own journey. I'd love to hear from you! 🚀

---

*What's your development story? I'd love to hear about your journey in the comments below.*
        `,
        featuredImage: {
          url: "/blog-journey.jpg",
          alt: "Developer working on multiple screens"
        },
        category: "personal",
        tags: ["career", "journey", "full-stack", "development", "personal"],
        status: "published",
        publishedAt: new Date('2024-03-01'),
        isSticky: true,
        isFeatured: false,
        author: adminUser._id
      }
    ];

    // Create blogs
    const blogs = await Blog.insertMany(blogsData);
    console.log(`📝 Created ${blogs.length} blog posts`);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`👤 Users: 1`);
    console.log(`📁 Projects: ${projects.length}`);
    console.log(`📝 Blogs: ${blogs.length}`);
    console.log('\n🔐 Admin Login:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123456'}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Run the seed script
const runSeed = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

// Handle command line execution
if (require.main === module) {
  runSeed();
}

module.exports = { seedData };