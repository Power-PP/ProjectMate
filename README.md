# MongoDB Migration Guide: From Firebase to MongoDB + Node.js

## Complete Implementation Plan with Code References

**Document Purpose**: Complete guide for building a full-stack ProjectMate with MongoDB backend instead of Firebase. Designed for backend developers learning full-stack development.

**Target**: 4-6 weeks implementation with understanding of every concept

---

## Table of Contents

- [Overview](#overview)
- [Why MongoDB Instead of Firebase](#why-mongodb-instead-of-firebase)
- [Complete Tech Stack](#complete-tech-stack)
- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Project Documentation](#project-documentation)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Authors](#authors)

## ✨ Features

### Core Features
- 🔐 **User Authentication** - Secure Firebase authentication with email/password
- 👤 **Profile Management** - Create and customize developer profiles with GitHub integration
- 📝 **Post Projects** - Share project ideas and find collaborators
- 🔍 **Developer Search** - Discover developers by skills and interests
- 🤝 **Connections** - Build your professional network
- 🎯 **Live Contests** - Browse coding contests from HackerRank, HackerEarth, and more
- 📈 **Trending Feed** - Discover trending projects and posts
- 💬 **Real-time Updates** - Live data synchronization with Firestore

### Coming Soon
- Direct messaging between developers
- Project collaboration tools
- Skill endorsements
- Portfolio builder
- Advanced search filters
- Email notifications

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | ^17.0.2 | UI framework |
| React Router DOM | ^5.3.0 | Client-side routing |
| Tailwind CSS | 2.2 | Utility-first styling |
| Material-UI | ^4.12.3 | Component library |
| Chakra UI | ^1.7.4 | Component library |
| Formik | ^2.2.9 | Form management |
| Yup | ^0.32.11 | Schema validation |
| React Icons | ^4.3.1 | Icon library |

### Backend & Database
| Technology | Version | Purpose |
|-----------|---------|---------|
| Firebase | ^9.3.0 | BaaS platform |
| Firestore | Latest | NoSQL database |
| Firebase Auth | Latest | Authentication |
| Firebase Storage | Latest | Image/file storage |

### Build & Dev Tools
| Technology | Version | Purpose |
|-----------|---------|---------|
| Craco | ^6.4.2 | Create React App override |
| PostCSS | ^7.0.39 | CSS preprocessing |
| Autoprefixer | ^9.8.8 | CSS vendor prefixes |

## 📁 Project Structure

```
ProjectMate/
├── public/                      # Static files
│   ├── index.html              # HTML entry point
│   ├── manifest.json           # PWA manifest
│   ├── robots.txt              # SEO robots file
│   └── _redirects              # Netlify redirects
├── src/
│   ├── App.js                  # Main app component
│   ├── index.js                # React entry point
│   ├── firebase.js             # Firebase configuration
│   ├── index.css               # Global styles
│   ├── Api/                    # External API integrations
│   │   ├── getContest.js       # Kontests API wrapper
│   │   └── GetNews.js          # News API wrapper
│   ├── Components/             # Reusable components
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── Searchbar.jsx       # Developer search
│   │   ├── Card.jsx            # Post card component
│   │   ├── Input.jsx           # Form input component
│   │   ├── CustomDropdown.jsx  # Dropdown menu
│   │   ├── Particles.jsx       # Animated background
│   │   ├── CustomTable/        # Data table component
│   │   ├── Loader/             # Loading spinner
│   │   ├── Toast/              # Toast notifications
│   │   ├── Profile/            # Profile card
│   │   ├── News/               # News display
│   │   └── EditProfile/        # Profile editing forms
│   ├── Pages/
│   │   ├── Auth/               # Authentication pages
│   │   │   ├── LoginPage/      # Login form
│   │   │   └── SignUpPage/     # Registration form
│   │   └── AppContainer/       # Protected app pages
│   │       ├── Dashboard.jsx   # Home/feed page
│   │       ├── ProfilePage.jsx # User profile
│   │       ├── EditProfile.jsx # Edit profile page
│   │       ├── Contests.jsx    # Contests listing
│   │       ├── Connections.jsx # Network/connections
│   │       ├── Trends.jsx      # Trending content
│   │       ├── Post.jsx        # Post display
│   │       └── NotFound.jsx    # 404 page
│   └── assets/                 # Images and icons
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── craco.config.js             # Craco configuration
├── README.md                   # This file
├── CONTRIBUTING.md             # Contribution guidelines
├── SETUP.md                    # Development setup guide
├── DEPLOYMENT.md               # Deployment guide
└── SECURITY.md                 # Security policy
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
  ```bash
  node --version  # v14.0.0 or higher
  ```
- **npm** (v6.0.0 or higher) - Comes with Node.js
  ```bash
  npm --version   # v6.0.0 or higher
  ```
- **Git** - [Download](https://git-scm.com/)
  ```bash
  git --version
  ```

### Account Requirements
- **GitHub Account** - For OAuth integration and repository hosting
- **Firebase Account** - Create at [firebase.google.com](https://firebase.google.com/)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/YourUsername/ProjectMate.git
cd ProjectMate
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`.

### Step 3: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Storage
4. Get your Firebase config from Project Settings
5. Create/update `.env.local` file (see [Environment Variables](#environment-variables))

### Step 4: (Optional) GitHub OAuth Setup

To enable GitHub login:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - **Authorization callback URL**: `http://localhost:3000/login`
3. Add credentials to Firebase Authentication → OAuth setup

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_DATABASE_URL=your_database_url_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here

# API Keys (Optional)
REACT_APP_NEWS_API_KEY=your_news_api_key_here
```

**⚠️ WARNING**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## 💻 Running the Project

### Development Server

```bash
npm start
```

- Opens automatically at `http://localhost:3000`
- Hot-reload enabled - changes reflect instantly
- Console shows compilation messages and errors

### Production Build

```bash
npm run build
```

Creates optimized production build in `build/` directory.

### Testing

```bash
npm test
```

Runs test suite using Jest and React Testing Library.

## 📚 Project Documentation

- **[SETUP.md](./SETUP.md)** - Detailed development environment setup
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines and workflow
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment instructions
- **[SECURITY.md](./SECURITY.md)** - Security policies and vulnerability reporting

## 🎯 Key Routes

| Route | Purpose | Auth Required |
|-------|---------|----------------|
| `/` | Root redirect | - |
| `/login` | User login | No |
| `/signup` | User registration | No |
| `/dashboard` | Main feed/home | Yes |
| `/profile` | User profile | Yes |
| `/settings/personal` | Edit profile | Yes |
| `/settings/updatepassword` | Change password | Yes |
| `/connections` | Find developers | Yes |
| `/contests` | Live contests | Yes |
| `/trends` | Trending posts | Yes |
| `/notFound` | 404 error | - |

## 📊 Database Schema (Firestore)

### Collections

#### `users`
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "profile_image_url",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `personal-info`
```javascript
{
  Email_id: "user@example.com",
  Github: "github_username",
  Bio: "User bio",
  Skills: ["JavaScript", "React", "Node.js"],
  Location: "City, Country",
  ProfileImage: "image_url"
}
```

#### `Post`
```javascript
{
  title: "Project Title",
  description: "Project description",
  author: "user_email",
  timestamp: timestamp,
  likes: 0,
  comments: [],
  images: ["image_urls"]
}
```

## 🔄 Authentication Flow

```
User visits /
    ↓
Check Firebase auth state (App.js)
    ↓
User logged in?
    ├─ YES → Redirect to /dashboard
    └─ NO → Redirect to /login
         ↓
    User enters credentials
         ↓
    Firebase Auth validates
         ↓
    Success → Set localStorage, Redirect to /dashboard
    Fail → Show error toast message
```

## 🤝 Contributing

We love contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- How to report bugs
- Suggesting enhancements
- Submitting pull requests
- Code style guidelines
- Commit message conventions

### Quick Start for Contributors

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YourUsername/ProjectMate.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes and commit
git add .
git commit -m "feat: add new feature description"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Open a Pull Request
```

## 🐛 Bug Reports & Feature Requests

- **Bugs**: [Report Issues](https://github.com/YourUsername/ProjectMate/issues)
- **Features**: [Request Feature](https://github.com/YourUsername/ProjectMate/discussions)

## 🔒 Security

Please see [SECURITY.md](./SECURITY.md) for security policies and reporting vulnerabilities.

### Key Security Practices
- Firebase credentials in environment variables only
- Input validation with Formik + Yup
- XSS protection via React's built-in escaping
- Firestore security rules configured
- Regular dependency updates

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

## 👥 Authors & Contributors

### Core Team
- **Rutika** - [GitHub](https://github.com/Rutika2001)
- **Pranali** - [GitHub](https://github.com/Pranalibit)
- **Pratiksha** - [GitHub](https://github.com/pratiksha-ui)
- **Om** - [GitHub](https://github.com/omichan222)

### Contributing to the Project?
See [CONTRIBUTING.md](./CONTRIBUTING.md#contributors) to add yourself to the contributors list!

## 📞 Support & Community

- **Questions?** Open a [Discussion](https://github.com/YourUsername/ProjectMate/discussions)
- **Found a Bug?** [Report an Issue](https://github.com/YourUsername/ProjectMate/issues)
- **Want to Help?** See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Firebase for reliable backend services
- Tailwind CSS for utility-first styling
- All open-source projects we depend on

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/YourUsername">ProjectMate Team</a>
  <br>
  <a href="#top">⬆️ Back to Top</a>
</p>
