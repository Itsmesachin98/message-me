# MessageMe 💬

MessageMe is a lightweight, real-time chat application built with a modern JavaScript stack. It features secure authentication, real-time messaging, online presence tracking, and profile image uploads — designed with a clean architecture and developer-friendly setup.

---

## ✨ Features

-   Secure email/password authentication using JWT (cookie-based)
-   Real-time 1-to-1 messaging with Socket.IO
-   Online / offline presence updates in real time
-   User profile picture upload via Cloudinary
-   Responsive UI built with React + Tailwind CSS
-   Clean separation of frontend and backend
-   Optimized for local development and production deployment

---

## 🛠 Tech stack

### Backend

-   Node.js
-   Express.js
-   MongoDB + Mongoose
-   Socket.IO
-   JWT Authentication
-   Cloudinary (image uploads)

### Frontend

-   React (Vite)
-   Tailwind CSS
-   Zustand (state management)
-   Axios
-   socket.io-client

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

-   Node.js (v18+ recommended)
-   npm or yarn
-   MongoDB (local or cloud)
-   Cloudinary account (for profile images)

---

## 🔧 Backend Setup

1. Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file inside `backend/`:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

3. Start the backend server:

```bash
npm run dev
```

📍 Backend runs by default at:  
`http://localhost:5001`  
API base path: `/api`

---

## 🎨 Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

2. The frontend will be available at:

```
http://localhost:5173
```

CORS is preconfigured on the backend to allow this origin during development.

---

## 🧪 Usage

1. Open `http://localhost:5173` in your browser
2. Sign up or log in
3. Upload a profile picture
4. Start real-time conversations
5. See online users update instantly

---

## 🔐 Environment Variables Reference

### Backend (`backend/.env`)

| Variable                | Description                   |
| ----------------------- | ----------------------------- |
| `PORT`                  | Backend server port           |
| `MONGODB_URI`           | MongoDB connection string     |
| `JWT_SECRET`            | JWT signing secret            |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name         |
| `CLOUDINARY_API_KEY`    | Cloudinary API key            |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret         |
| `NODE_ENV`              | `development` or `production` |

### Frontend

The frontend Axios instance uses:

```js
baseURL: http://localhost:5001/api
```

Update this value when deploying the backend.

---

## 📁 Project Structure (high level)

-   `backend/` — Express API

    -   `src/index.js` — server entry
    -   `src/routes/` — API routes (`auth.route.js`, `message.route.js`)
    -   `src/controllers/` — request handlers
    -   `src/models/` — Mongoose models
    -   `src/lib/` — helpers (db, cloudinary, socket, utils)

-   `frontend/` — React app (Vite)
    -   `src/main.jsx`, `src/App.jsx` — app entry
    -   `src/components/` — UI components
    -   `src/pages/` — pages (Home, Login, Signup, Profile)
    -   `src/lib/axios.js` — axios instance
    -   `src/store/` — zustand stores

---

## 📌 Future Improvements

-   Message read receipts
-   Typing indicators
-   Group chats
-   End-to-end encryption
-   Push notifications

---

## 📄 License

This project is licensed under the MIT License.
