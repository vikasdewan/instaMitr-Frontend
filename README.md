
# 📸 InstaMitr

A full-fledged **Instagram Clone** built using the **MERN Stack**, designed to replicate the core functionality of Instagram with additional real-time features, modern UI, and mobile responsiveness. Built with passion, this project brings you features like posting, chatting, reels, search, explore, and more — all under one platform!

---

## 🚀 Live Demo

🔗 [Click here to visit the  InstaMitr](https://instamitr-deploy-1.onrender.com)

🧪 **Demo Credentials**  
- 📧 Email: `demo@gmail.com`  
- 🔐 Password: `1234`

---

## 🧠 Concept

InstaMitr is a **feature-rich, real-time social media web app** that offers users the ability to share moments, interact with others, and build their digital network — just like Instagram. This app supports **real-time chat**, **reels**, **explore**, and a lot more.

---

## 💡 Features

### 📤 Post Management
- ✅ Upload image posts with captions
- 🗑️ Delete posts
- ❤️ Like/unlike posts
- 💬 Real-time comment system

### 🎥 Reels Section
- Browse short-form videos
- Auto-play and responsive video player

### 🧭 Explore Page
- View content from users you don’t follow

### 🔍 Search Page
- Search users dynamically by name or username

### 💬 Real-Time Chat (Socket.IO)
- One-to-one messaging using **Socket.IO**
- Instant delivery and real-time updates

### 👥 Follow / Unfollow System
- See posts from people you follow
- Dynamic follow button & follower counts

### ✏️ Edit Profile
- Upload/change profile picture
- Update bio information

### 🧠 Suggested Users
- Displays accounts you don’t follow yet

### 🎵 Upcoming Feature (Planned)
- Add music from Spotify/YouTube to image posts (Bollywood/Hollywood support planned)

### 📱 Fully Responsive
- Optimized layout for **mobile**, **tablet**, and **desktop**

### 📞 Future Enhancement (Planned)
- **Video Calling** using **WebRTC** for seamless face-to-face communication

---

## 🛠️ Tech Stack & Libraries

### 🔗 Frontend
- **React.js** – SPA framework (with Vite for bundling)
- **Tailwind CSS** – Utility-first styling
- **React Router DOM** – Routing and navigation
- **Axios** – API handling
- **Socket.IO Client** – Real-time messaging
- **Cloudinary** – Image & video hosting

### 🧠 Backend
- **Node.js** – Server runtime
- **Express.js** – RESTful API framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object modeling
- **Socket.IO** – WebSockets for real-time communication
- **Multer** – File upload middleware
- **Cloudinary SDK** – Media management
- **JSON Web Token (JWT)** – Authentication
- **bcryptjs** – Password hashing
- **dotenv** – Environment variable management
- **Cors** – Cross-origin resource sharing

---

## 📂 Folder Structure (Frontend)
```
src/
│
├── components/         # Reusable UI components (Navbar, Cards, etc.)
├── pages/              # Routes (Home, Profile, Chat, etc.)
├── context/            # Context APIs (User Auth, Chat State)
├── utils/              # Helper functions & constants
├── App.jsx             # Main app with routes
└── main.jsx            # React root
```

## 📂 Folder Structure (Backend)
```
backend/
│
├── controllers/        # Business logic for APIs
├── routes/             # API routes (auth, post, user, chat)
├── models/             # Mongoose schemas
├── middleware/         # Auth checks, upload configs
├── config/             # DB connection, cloudinary setup
└── server.js           # Entry point
```

---

## 🧪 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/InstaMitr.git
   cd InstaMitr
   ```

2. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Configure .env**
   Create `.env` files in both `client/` and `backend/` for:
   - MongoDB URI
   - JWT Secret
   - Cloudinary credentials

---

## 🤝 Contributing

Feel free to fork this repository, make changes, and submit pull requests. Feedback, feature requests, and issue reports are always welcome!

---

## 📩 Contact

📧 Email: dewanganvikas192@gmail.com 
🌐 LinkedIn: [linkedin.com/in/vikasdewangan001](https://www.linkedin.com/in/vikasdewangan001/)

---

## 🌟 Show Some Love

If you liked this project, please ⭐ the repo and share your feedback!  
Let’s build more cool things together 👨‍💻💬

---

## 📌 License

This project is licensed under the MIT License.

---

## 🔖 Tags

`#MERN` `#InstagramClone` `#FullStackApp` `#SocketIO` `#WebRTC` `#Cloudinary` `#JWT` `#MongoDB` `#ReactJS` `#NodeJS` `#ExpressJS` `#SocialApp` `#OpenSource` `#RealtimeChat` `#TailwindCSS`
