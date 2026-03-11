# ChatSync

**ChatSync** is a production-style **real-time messaging platform** built to demonstrate full-stack engineering skills including authentication, real-time communication, scalable backend architecture, and modern frontend state management.

The project simulates a real-world messaging system with **secure authentication, real-time chat, media uploads, and presence tracking**.

**Live Demo**
https://chatsync-hub.vercel.app

---

# Key Highlights

- Secure **JWT authentication using HTTP-only cookies**
- **Real-time messaging** powered by Socket.IO
- **Optimistic UI updates** for instant message delivery
- **Online/offline presence detection**
- **Image messaging and profile uploads via Cloudinary**
- Clean and scalable **modular backend architecture**
- Efficient client state management using **Zustand**

This project demonstrates **production-style engineering patterns** often discussed in technical interviews.

---

# Technical Skills Demonstrated

### Backend Engineering

- REST API design
- Secure authentication with JWT cookies
- WebSocket architecture using Socket.IO
- MongoDB schema design with Mongoose
- Middleware-based validation and protection
- Cloud asset management

### Frontend Engineering

- React single-page application architecture
- Global state management with Zustand
- Real-time UI synchronization
- Optimistic UI updates
- Responsive UI with Tailwind CSS

### System Design Concepts

- Event-driven real-time systems
- Room-based messaging architecture
- Separation of REST APIs and WebSocket events
- Modular project structure for scalability

---

# Tech Stack

**Backend**

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- Joi Validation
- Cloudinary

**Frontend**

- React
- Vite
- Tailwind CSS
- DaisyUI
- Zustand
- socket.io-client
- React Router

**Developer Tools**

- Nodemon
- ESLint
- React Hot Toast
- Lucide Icons

---

# Core Features

### Authentication

- Secure signup and login
- JWT stored in **HTTP-only cookies**
- Protected API routes via authentication middleware
- Session validation endpoint

### Real-Time Messaging

- 1-to-1 chat using **Socket.IO**
- Conversation-based rooms
- Instant message broadcasting
- Optimistic UI updates

### Online Presence

- Detects connected users in real time
- Broadcasts active users to clients

### Media Handling

- Profile image uploads
- Image messages inside chat
- Cloudinary image transformations and cleanup
- File size validation

### Chat Persistence

- MongoDB conversation storage
- Message history retrieval
- Conversation lookup between users

---

# Clone and Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Itsmesachin98/message-me.git
cd message-me
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` inside **backend/**

```env
PORT=5001
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
JWT_COOKIE_NAME=accessToken
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

NODE_ENV=development
```

Start backend server:

```bash
npm run dev
```

---

### 3. Setup Frontend

Open another terminal.

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

### 4. Environment Configuration

Create `.env` inside **frontend/**

```env
VITE_API_BASE_URL=http://localhost:5001
```

Axios configuration uses:

```js
withCredentials: true;
```

to support **cookie-based authentication**.

---

# Testing the Application

1. Open the application
2. Register two different users
3. Login in two browser sessions
4. Start a conversation
5. Send text or image messages
6. Observe real-time updates
7. Inspect stored messages in MongoDB

---

# Future Improvements

- Group chats and channels
- Typing indicators
- Message read receipts
- Chat pagination
- End-to-end encryption
- Automated E2E tests (Playwright / Cypress)

---

# Author

Sachin Kumar

Full-stack developer focused on **backend systems, real-time applications, and scalable architecture**.

---

# License

MIT
