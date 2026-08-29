# Full-Stack MERN Blog Application

A full-stack Blog Application built with the **MERN** stack (**MongoDB, Express.js, React.js, Node.js**) styled with **Tailwind CSS**. Users can register, log in, view blogs by all authors, publish their own blogs, update their own blogs, and delete their own blogs. 

Strict **JWT-based authentication** and **ownership-based authorization** are enforced on the Express backend to prevent unauthorized updates or deletions.

---

## 🌟 Key Features

- **User Authentication**: Secure user registration and login with password hashing (`bcryptjs`) and JWT token authentication.
- **Persistent Auth State**: Client-side state persistence (`AuthContext` + `localStorage`) with protected routing.
- **Blog Management (CRUD)**:
  - **Create**: Authenticated users can publish blog posts with category and custom tags.
  - **Read**: All users can explore published blogs, search by keyword, filter by category, and read full articles with estimated reading time.
  - **Update**: Only the author of a blog post can edit its content.
  - **Delete**: Only the author of a blog post can delete it (with confirmation modal).
- **Backend Authorization Enforcement**: Even if edit/delete request URLs are manually triggered or manipulated, the Express backend verifies `blog.author` against `req.user.id` and rejects unauthorized attempts with a `403 Forbidden` error.
- **Modern Responsive UI**: Built with React, Tailwind CSS, Lucide icons, glassmorphism card aesthetics, and subtle micro-animations.
- **Automatic Database Fallback**: Built-in fallback to `mongodb-memory-server` if a local or remote MongoDB instance is not active, enabling out-of-the-box runnability without manual MongoDB setup.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (Bootstrapped with Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Token (`jsonwebtoken`)
- **Password Hashing**: `bcryptjs`
- **CORS**: `cors`
- **Fallback DB**: `mongodb-memory-server`

---

## 📁 Project Structure

```
Blog Application/
├── server/                    # Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection & automated memory fallback
│   │   ├── controllers/
│   │   │   ├── auth.controller.js  # Registration, Login, Get User Info
│   │   │   └── blog.controller.js  # Blog CRUD + Ownership validation
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js  # JWT Bearer token protection
│   │   │   └── error.middleware.js # Centralized API error handling
│   │   ├── models/
│   │   │   ├── User.js        # User Mongoose Schema
│   │   │   └── Blog.js        # Blog Mongoose Schema (ref User)
│   │   ├── routes/
│   │   │   ├── auth.routes.js # Auth endpoints
│   │   │   └── blog.routes.js # Blog endpoints
│   │   └── index.js           # Express app entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
├── client/                    # Vite + React Frontend
│   ├── src/
│   │   ├── components/        # Navbar, Footer, BlogCard, ProtectedRoute, ConfirmModal
│   │   ├── context/           # AuthContext for global user state
│   │   ├── pages/             # Home, Login, Register, BlogDetails, CreateBlog, EditBlog, MyBlogs, Profile, NotFound
│   │   ├── services/          # Axios API layer with JWT interceptor
│   │   ├── App.jsx            # Main app router
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Tailwind directives & glassmorphism theme
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md                  # Project documentation
```

---

## 🔒 Authorization & Security Matrix

| Action | Unauthenticated | Logged-In User | Blog Owner | Non-Owner User |
| :--- | :---: | :---: | :---: | :---: |
| **Register Account** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Log In** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Read All Blogs** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Read Blog Details** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Create Blog** | ❌ 401 Unauthorized | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Update Blog** | ❌ 401 Unauthorized | ❌ 403 Forbidden | ✅ 200 OK | ❌ 403 Forbidden |
| **Delete Blog** | ❌ 401 Unauthorized | ❌ 403 Forbidden | ✅ 200 OK | ❌ 403 Forbidden |

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Optional - automated in-memory fallback will run automatically if MongoDB is not running locally)

---

### Step 1: Clone or Navigate to Project Directory
```bash
cd "Blog Application"
```

---

### Step 2: Backend Setup & Launch

1. Navigate to `server` folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   A `.env` file is included in `server/`. You can customize the settings if needed:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/blog-app
   JWT_SECRET=super_secret_jwt_key_blog_app_2026_dev_mode
   JWT_EXPIRES_IN=7d
   ```

4. Start Backend Server:
   ```bash
   npm start
   # or for development mode with auto-reload:
   npm run dev
   ```
   > Server will run at `http://localhost:5000`.

---

### Step 3: Frontend Setup & Launch

1. Open a new terminal window and navigate to `client` folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Frontend Development Server:
   ```bash
   npm run dev
   ```
   > React application will launch at `http://localhost:3000`.

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate user & return JWT token.
- `GET /api/auth/me` - Get current authenticated user info *(Protected)*.

### Blogs (`/api/blogs`)
- `GET /api/blogs` - Fetch all blog posts (supports `?search=` and `?category=` query params).
- `GET /api/blogs/:id` - Fetch single blog post by ID.
- `GET /api/blogs/user/me` - Fetch blogs authored by logged-in user *(Protected)*.
- `POST /api/blogs` - Create a new blog post *(Protected)*.
- `PUT /api/blogs/:id` - Update a blog post *(Protected + Owner Only)*.
- `DELETE /api/blogs/:id` - Delete a blog post *(Protected + Owner Only)*.

---

## 🧪 Testing Backend Ownership Authorization

You can verify ownership security by testing with two registered users:

1. **Register User A** (`userA@test.com`) and **User B** (`userB@test.com`).
2. Log in as **User A** and create a blog post.
3. Copy the created blog post ID (`<BLOG_ID>`).
4. Log in as **User B** (or use User B's JWT token in Postman / cURL).
5. Attempt a `PUT /api/blogs/<BLOG_ID>` or `DELETE /api/blogs/<BLOG_ID>`.
6. The backend will inspect the token, verify that `blog.author !== req.user.id`, and return:
   ```json
   {
     "success": false,
     "message": "Forbidden: You are not authorized to update this blog. Only the original author can edit it."
   }
   ```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
