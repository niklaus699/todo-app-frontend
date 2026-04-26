# 🚀 Real-Time Full-Stack Todo App

A feature-rich, high-performance task management application built using **React** and **Node.js**. This project demonstrates a complete full-stack workflow, featuring real-time data synchronization, intuitive UX through drag-and-drop, and a polished, responsive UI.

## 🌟 Key Features

* **Real-Time Sync:** Integrated **WebSockets** to ensure that any change made in one browser tab (adding, deleting, or moving a task) is instantly reflected across all other open instances without a page refresh.
* **Drag & Drop Interface:** Smooth, interactive task reordering for a modern user experience.
* **Theming:** A comprehensive **Light/Dark mode** toggle that persists across sessions.
* **Smart Form Validation:** Robust client-side validation to prevent invalid entries and ensure data consistency.
* **Cross-Tab Communication:** Backend-driven updates that keep the state in sync globally.

---

## 🛠️ Tech Stack

**Frontend:**
* **React.js:** Component-based UI architecture.
* **JavaScript (ES6+):** Logic and state management.
* *Tailwind Styled Components:** For the light/dark theme implementation.

**Backend:**
* **Node.js & Express:** Scalable server-side API.
* **WebSockets (Socket.io):** Enabling bi-directional real-time communication.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v14+)
* npm or yarn


## 📝 Implementation Details

* **Form Validation:** Implemented custom logic to handle empty states and character limits, providing immediate feedback to the user.
* **WebSockets:** Instead of traditional polling, the backend emits events on every mutation, which the React frontend listens for to update its local state dynamically.
* **Theme Toggle:** Utilized CSS variables to manage color palettes, allowing for seamless switching between light and dark modes.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
