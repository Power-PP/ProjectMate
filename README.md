# ProjectMate

ProjectMate is a premium full-stack developer collaboration and networking platform. It helps developers discover active open-source projects, apply for matching roles based on skill overlap percentages, and build detailed academic and professional portfolios.

The project is built using a modern **BFF (Backend-for-Frontend) Architecture** with **Spring Boot** and **MongoDB Atlas** powering the backend, and **React** on the frontend.

---

## 🛠 Tech Stack

### Backend (BFF)
*   **Java 17** & **Spring Boot 3.3.0**
*   **Spring Security** (Session-based cookie authentication)
*   **Spring Data MongoDB** (Persisting to MongoDB Atlas database)
*   **Lombok** & **Maven**

### Frontend
*   **React** (Single Page Application)
*   **Vanilla CSS** (Premium UI/UX with dark mode support, glassmorphism, HSL colors)
*   **React Router** & Custom routing state

---

## 📁 Directory Structure

```
ProjectMate/
├── backend/                  # Spring Boot Java application (Port 8080)
│   ├── src/main/java/        # Controllers, Models, Repositories, Security
│   ├── src/main/resources/   # Configuration (application.yml)
│   └── pom.xml               # Maven configuration
├── projectmate/              # React SPA frontend (Port 3000)
│   ├── src/components/       # Reusable components (Icons, Cards, Lists)
│   ├── src/pages/            # Dashboard, Projects, Developers, ProfilePage
│   ├── src/App.js            # App routing and layout binding
│   └── package.json          # npm dependencies
└── README.md                 # Project README (This file)
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
*   [Java JDK 17](https://adoptium.net/) or higher.
*   [Node.js](https://nodejs.org/) (v16+ recommended).
*   A running MongoDB cluster (e.g. MongoDB Atlas) or local MongoDB instance.

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Set your MongoDB URI as an environment variable:
    *   **Windows (PowerShell)**:
        ```powershell
        $env:MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/projectmate"
        ```
    *   **Windows (Command Prompt)**:
        ```cmd
        set MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/projectmate
        ```
    *   **macOS/Linux**:
        ```bash
        export MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/projectmate"
        ```
3.  Start the Spring Boot server:
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend runs on `http://localhost:8080`.

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd projectmate
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React app:
    ```bash
    npm start
    ```
    The web app will open at `http://localhost:3000`.

---

## 🧪 How to Test and Verify Latest Changes

To verify the newly implemented **Developer Portfolios, Profiles, and Project Association features (Phase 4)**, follow this manual verification flow:

### Step 1: Start Frontend and Backend
1. Start the Spring Boot backend using `./mvnw spring-boot:run` (making sure your `MONGODB_URI` environment variable is exported).
2. Start the React frontend using `npm start`.

### Step 2: Register Two Test Users
1. Open `http://localhost:3000` in your web browser.
2. Sign up with a new account (e.g., **Developer A**):
   * Email: `dev-a@example.com`
   * Password: `password123`
   * Name: `Developer A`
   * Role: `Backend Engineer`
3. Log out and sign up a second account (e.g., **Developer B**):
   * Email: `dev-b@example.com`
   * Password: `password123`
   * Name: `Developer B`
   * Role: `Frontend Designer`

### Step 3: Set up Developer A's Detailed Portfolio
1. Log in as **Developer A**.
2. Click on your avatar/name in the upper right-hand corner. This will open your brand-new **My Portfolio** page.
3. Click the **Edit Profile** button.
4. Populate the following fields:
   * **Bio**: "I am a Java Developer with 3 years of experience specializing in Spring Boot microservices and MongoDB databases."
   * **College / University**: "University of Engineering & Tech"
   * **Degree**: Select `BTech`
   * **Field of Study**: "Computer Science Engineering"
   * **Graduation Year**: "2025"
   * **GitHub Link**: `github-dev-a`
   * **LinkedIn Link**: `linkedin-dev-a`
   * **Personal Portfolio**: `deva-portfolio.dev`
5. Click **Save Profile**.
6. Verify that the credentials display correctly on your portfolio card.

### Step 4: Create a Project (Developer A)
1. Navigate to the **Projects** page or Dashboard.
2. Create a new project:
   * **Title**: "Spring Boot Microservice BFF"
   * **Description**: "Building a secure backend service utilizing Mongo databases."
   * **Tech Stack**: `Java, Spring Boot, MongoDB`
3. Click publish. The project will now show up under your **Projects & Collaborations** card on your Profile page.

### Step 5: Discover and View Developer A's Profile (Developer B)
1. Log out and log back in as **Developer B**.
2. Navigate to the **Find Collaborators** page (or click "Find developers" on the Dashboard).
3. Find **Developer A** in the search grid. Notice their card displays their academic details: `🎓 BTech • University of Engineering & Tech`.
4. Click the **Profile** button on Developer A's card.
5. Verify that:
   * You are redirected to Developer A's full profile.
   * You can see their detailed biography, full academic credentials, and external social link icons.
   * You can see their project listed under **Created Projects**.
   * The **Edit Profile** button is hidden since this is not your own profile.
6. Click **Back to Search** to return to the collaborator grid.
