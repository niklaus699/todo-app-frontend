<div align="center">
  <img src="./public/vite.svg" alt="Todo App Logo" width="80" />
  <h1 align="center">📋 Todo App</h1>
  <p align="center">
    <strong>A modern, full-stack task management application</strong>
    <br />
    Built with React · Vite · Tailwind CSS
  </p>
  <br />
  <p>
    <a href="#-features">Features</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#-educational-purpose">Educational Purpose</a>
  </p>
</div>

<br />

---

## ✨ Overview

Welcome to the **Todo App** — a fully functional task management application that lets you create, organize, and track your daily tasks with ease. Whether you are on your phone, tablet, or computer, this app adapts to your screen and helps you stay productive.

This project was built as a **hands-on learning exercise** to explore modern web development tools and patterns. It is not intended for production use, but rather as a showcase of how different technologies can work together to create a smooth and enjoyable user experience.

> 🎯 **Please note:** This application is created **solely for educational purposes**. It is a personal project designed to learn and practice full-stack web development concepts.

---

## 🚀 Features

Here is what you can do with this Todo App — explained in plain language:

| Feature | What it does |
| :------ | :----------- |
| **📝 Create Tasks** | Type your task in the input box at the top and press Enter (or click the circle button) to add it to your list. |
| **✅ Mark as Done** | Click the circle next to any task to mark it as completed. A checkmark appears and the task gets a strikethrough. |
| **🗑️ Delete Tasks** | Click the ✕ (cross) icon on any task to remove it permanently. |
| **🔍 Filter Your List** | Use the **All**, **Active**, and **Completed** buttons to view different subsets of your tasks. |
| **🧹 Clear Completed** | Click "Clear Completed" at the bottom to remove all finished tasks at once. |
| **↕️ Drag & Drop** | Grab any task by its left side and drag it up or down to reorder your list. This works with both mouse and touch! |
| **🌙 Light / Dark Mode** | Toggle between light and dark themes by clicking the sun/moon icon at the top. Your preference is saved automatically. |
| **🔐 User Accounts** | Create an account or log in to keep your tasks private and accessible only to you. |
| **📱 Responsive Design** | The app looks great and works smoothly on phones, tablets, and desktop screens. |

---

## 🖼️ Screenshots

<!-- Replace these placeholders with actual screenshots of your app -->

<div align="center">
  <table>
    <tr>
      <td><img src="./screenshots/desktop-light.png" alt="Desktop - Light Theme" width="400" /></td>
      <td><img src="./screenshots/desktop-dark.png" alt="Desktop - Dark Theme" width="400" /></td>
    </tr>
    <tr align="center">
      <td><strong>Desktop — Light Theme</strong></td>
      <td><strong>Desktop — Dark Theme</strong></td>
    </tr>
    <tr>
      <td><img src="./screenshots/mobile-light.png" alt="Mobile - Light Theme" width="200" /></td>
      <td><img src="./screenshots/mobile-dark.png" alt="Mobile - Dark Theme" width="200" /></td>
    </tr>
    <tr align="center">
      <td><strong>Mobile — Light Theme</strong></td>
      <td><strong>Mobile — Dark Theme</strong></td>
    </tr>
  </table>
</div>

> 💡 *Tip: You can take screenshots of your app and place them in a `screenshots/` folder, then update the image paths above.*

---

## 🛠️ Tech Stack

This project uses a modern set of tools. Here is a simple breakdown:

### Frontend

| Technology | What it is | Why it was used |
| :--------- | :--------- | :-------------- |
| [React](https://react.dev/) (v19) | A JavaScript library for building user interfaces | The core framework that powers the entire app. It makes the interface fast and interactive. |
| [Vite](https://vitejs.dev/) (v7) | A modern build tool | Compiles and serves the app extremely fast during development. |
| [Tailwind CSS](https://tailwindcss.com/) (v4) | A utility-first CSS framework | Makes styling quick and consistent without writing custom CSS. |
| [@dnd-kit](https://dndkit.com/) | A drag-and-drop toolkit | Powers the drag-to-reorder functionality with smooth animations. |
| [@heroicons/react](https://heroicons.com/) & [Lucide React](https://lucide.dev/) | Icon libraries | Provides the sun, moon, menu, check, and cross icons used throughout the app. |

### Backend Communication

| Technology | What it does |
| :--------- | :----------- |
| **REST API** | The frontend communicates with a backend server using standard HTTP requests (GET, POST, PUT, DELETE). |
| **JWT Authentication** | When you log in, you receive a secure token that proves your identity. This token is sent with every request to keep your tasks private. |

> 📡 **Note:** This repository contains only the **frontend** portion. It expects a backend API running at `http://localhost:5000/api` (configurable via the `.env` file).

---

## 🏗️ Project Structure

The code is organized in a clean, beginner-friendly way:

```
fronend/
├── public/                  # Static files (images, icons)
├── src/
│   ├── api/                 # Communication with the backend
│   │   ├── auth.js          #   → Login & registration requests
│   │   ├── todos.js         #   → Create, read, update, delete tasks
│   │   └── fetchWithAuth.js #   → Helper that attaches your auth token
│   ├── components/          # Reusable building blocks
│   │   ├── Row.jsx          #   → A single task row (with drag, check, delete)
│   │   ├── FilterButton.jsx #   → "All" / "Active" / "Completed" buttons
│   │   ├── CheckboxButton.jsx # → The circular checkbox
│   │   ├── DeleteButton.jsx #   → The ✕ delete button
│   │   ├── LoginForm.jsx    #   → Login form
│   │   ├── RegisterForm.jsx #   → Registration form
│   │   ├── AuthSwitch.jsx   #   → Toggle between login & register
│   │   ├── ErrorMessage.jsx #   → Displays error messages
│   │   └── useWindowWidth.jsx # → Tracks screen size for responsive design
│   ├── context/             # Global state management
│   │   └── AuthContext.jsx  #   → Stores login state (available everywhere)
│   ├── Auth.jsx             # The login / registration screen
│   ├── App.jsx              # The main todo list screen
│   ├── Root.jsx             # Decides which screen to show
│   ├── main.jsx             # The entry point that starts the app
│   └── index.css            # Global styles and theme definitions
├── index.html               # The HTML page
├── vite.config.js           # Vite configuration (plugins, path aliases)
├── package.json             # Project info and dependencies
├── .env                     # Environment variables (API URL)
└── README.md                # This file
```

---

## 🧪 Getting Started

Follow these steps to run the project on your own computer. No technical background needed — just follow along! 👇

### Prerequisites

- **Node.js** (version 18 or newer) — [Download here](https://nodejs.org/)
- **npm** (comes bundled with Node.js)

### Step-by-Step Instructions

```bash
# 1. Navigate to the project folder
cd TodoApp/frontend

# 2. Install all dependencies (this downloads the libraries the app needs)
npm install

# 3. Configure the backend URL (optional — the default should work if your
#    backend runs on port 5000)
#    Open the .env file and check:
#    VITE_API_URL=http://localhost:5000/api

# 4. Start the development server
npm run dev
```

Your browser should open automatically (or you can visit `http://localhost:5173`). You will see the app ready to use! 🎉

### Available Commands

| Command | What it does |
| :------ | :----------- |
| `npm run dev` | Starts a local development server with hot-reload (changes appear instantly). |
| `npm run build` | Builds the app for production (creates an optimized `dist/` folder). |
| `npm run preview` | Serves the production build locally so you can preview it. |
| `npm run lint` | Checks the code for potential errors and style issues. |

---

## 🧠 Behind the Scenes (For the Curious)

Here are some interesting implementation details explained simply:

### 🎨 Theme Switching

The app uses **CSS custom properties** (also called CSS variables). When you click the sun/moon icon, it adds a `dark` class to the HTML element, which changes the values of these variables. Tailwind CSS reads the updated variables and the entire interface changes color instantly — without reloading the page!

### 🔄 Drag & Drop Reordering

When you drag a task to a new position, the app:
1. Updates the list immediately on screen (so it feels fast and responsive).
2. Sends the new order to the backend in the background.
3. If the server request fails, it **reverts** to the original order (so you never lose data).

### 🔐 Authentication Flow

1. You create an account or log in.
2. The backend sends back a **token** (a sort of digital ID card).
3. This token is saved in your browser's local storage.
4. Every time the app talks to the backend, it shows this ID card to prove who you are.
5. When you log out, the ID card is removed.

---

## 📚 Educational Purpose

This project was built as a **learning exercise** to practice and demonstrate:

- 🧩 Building a complete user interface with **React** (components, state management, hooks)
- 🎨 Styling with **Tailwind CSS** and custom CSS theming (light/dark mode)
- 🔄 Implementing **drag-and-drop** interactions with **@dnd-kit**
- 📡 Connecting a frontend to a **REST API** with authentication
- 📱 Creating a **responsive design** that works across devices
- 🛠️ Using modern tooling with **Vite** for fast development
- 📂 Organizing code in a **clean, maintainable project structure**

> ⚠️ **Disclaimer:** This application is not intended for commercial or production use. It is a personal, educational project created solely for learning and portfolio purposes. Some features (such as error handling, security hardening, and accessibility) may not meet production-grade standards.

---

## 🙏 Acknowledgments

- This project is based on the [Todo App challenge](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW) from **Frontend Mentor**, an excellent platform for practicing front-end development skills.
- The beautiful **Josefin Sans** font is provided by [Google Fonts](https://fonts.google.com/specimen/Josefin+Sans).
- Icons are courtesy of [Heroicons](https://heroicons.com/) and [Lucide](https://lucide.dev/).

---

<div align="center">
  <p>
    Made with ❤️ for learning and growth
    <br />
    <sub>Built with React • Vite • Tailwind CSS</sub>
  </p>
</div>
