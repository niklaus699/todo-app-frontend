# Todo App — Frontend (User Interface)

> **The visual face of the Todo App.**  
> This is what you see and interact with in your browser — a clean, modern to-do list that works on any device, supports light and dark themes, and lets you drag and drop to reorder your tasks.

---

## 📋 Table of Contents

- [What Is This?](#-what-is-this)
- [How It Works (For Non-Technical Readers)](#-how-it-works-for-non-technical-readers)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Feature Tour](#-feature-tour)
- [How the Frontend Talks to the Backend](#-how-the-frontend-talks-to-the-backend)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Styling & Design](#-styling--design)
- [Deployment Notes](#-deployment-notes)

---

## 🧭 What Is This?

This is the **frontend** — the user interface of the Todo App. It is a web application that runs in your browser and provides everything you see on screen: the input field where you type new tasks, the list of your todos, the buttons to mark items as done or delete them, and the controls to switch between light and dark mode.

The frontend is built with **React**, a popular JavaScript library for building interactive user interfaces. It uses **Vite** as its build tool (which makes the app load and refresh very fast during development) and **Tailwind CSS** for styling (which keeps the design consistent and responsive).

Think of the frontend as the **dashboard of a car** — it's where all the controls, dials, and displays are. You interact with the dashboard, but the actual work (speed, engine, braking) happens under the hood. Similarly, the frontend sends your actions to the backend server, which stores and manages your data.

---

## 🧠 How It Works (For Non-Technical Readers)

| What You See On Screen | What Happens Behind The Scenes |
|---|---|
| A login/register screen | The frontend sends your email and password to the backend, which checks if you're a real user |
| An input box saying "Create a new todo..." | When you type and press Enter, the frontend sends your text to the backend to be saved |
| A list of your todos | The frontend asked the backend "what todos does this person have?" and displays the answer |
| A checkbox next to each todo | Clicking it tells the backend "mark this one as done" |
| An X button to delete | Clicking it tells the backend "remove this one forever" |
| Buttons for "All", "Active", "Completed" | These filter what you see — the backend still has all your todos, the frontend just hides some |
| Dragging a todo to a new position | The frontend tells the backend the new order, and the backend saves it |
| A sun/moon icon to toggle dark mode | This is purely visual — it just switches the colors on your screen, nothing is sent to the backend |
| A "Logout" button | The frontend discards your security token, and the login screen reappears |

---

## 🛠 Technology Stack

| Technology | Purpose | Why It Was Chosen |
|---|---|---|
| **React 19** | UI library | Builds the user interface as reusable components (like Lego bricks) |
| **Vite 7** | Build tool | Super-fast development server and optimized production builds |
| **Tailwind CSS 4** | CSS framework | Makes styling easy with ready-made utility classes — no need to write custom CSS |
| **React Router** *(implicit)* | Navigation | Manages which screen (login vs. todo list) is shown |
| **@dnd-kit** | Drag & Drop | Enables smooth drag-and-drop reordering of the todo list |
| **@heroicons/react** | Icons | Provides the sun, moon, and menu icons used in the interface |
| **Lucide React** | Icons | Provides the checkmark and close (X) icons |
| **Vitest** | Test runner | Runs automated tests for the frontend components and API calls |
| **Testing Library** | Component testing | Simulates user interactions in tests (clicking, typing, etc.) |
| **MSW (Mock Service Worker)** | API mocking | Intercepts network requests during tests so we don't need a real backend |

---

## 📁 Project Structure

```
frontend/
├── .env                    # Environment variables (API URL, configuration)
├── .gitignore              # Files Git should ignore
├── index.html              # Main HTML file (the entry point for the browser)
├── package.json            # Project metadata and dependencies
├── vite.config.js          # Vite configuration (plugins, aliases)
├── vitest.config.js        # Vitest test runner configuration
├── style-guide.md          # Design reference (colors, fonts, layout sizes)
│
├── public/
│   └── images/
│       ├── bg-desktop-dark.jpg    # Background image for dark mode (desktop)
│       ├── bg-desktop-light.jpg   # Background image for light mode (desktop)
│       ├── bg-mobile-dark.jpg     # Background image for dark mode (mobile)
│       ├── bg-mobile-light.jpg    # Background image for light mode (mobile)
│       ├── favicon-32x32.png      # Browser tab icon
│       ├── icon-check.svg         # Checkmark icon
│       ├── icon-cross.svg         # Cross/delete icon
│       ├── icon-moon.svg          # Moon icon (dark mode toggle)
│       ├── icon-sun.svg           # Sun icon (light mode toggle)
│       └── vite.svg               # Vite logo
│
└── src/
    ├── main.jsx           # Application entry point — renders the app
    ├── App.jsx            # Main todo list component (the core of the app)
    ├── Auth.jsx           # Authentication screen (login/register)
    ├── Root.jsx           # Root component — decides whether to show Auth or App
    ├── index.css          # Global styles, CSS variables, Tailwind imports
    │
    ├── api/
    │   ├── auth.js        # Functions for login and register API calls
    │   ├── todos.js       # Functions for todo CRUD and reorder API calls
    │   └── fetchWithAuth.js  # Helper that attaches the auth token to requests
    │
    ├── components/
    │   ├── AuthSwitch.jsx       # Toggle button (Login / Register)
    │   ├── LoginForm.jsx        # Login form (email & password)
    │   ├── RegisterForm.jsx     # Registration form (username, email, password)
    │   ├── Row.jsx              # A single todo row in the list (with drag support)
    │   ├── CheckboxButton.jsx   # Circular checkbox with checkmark icon
    │   ├── DeleteButton.jsx     # X button to delete a todo
    │   ├── FilterButton.jsx     # Filter button (All / Active / Completed)
    │   ├── ErrorMessage.jsx     # Displays error messages with an icon
    │   └── useWindowWidth.jsx   # Custom hook that tracks the window width
    │
    ├── context/
    │   ├── AuthContext.jsx  # React context for authentication state
    │   ├── useAuth.js       # Hook to access auth context from any component
    │   └── index.js         # Barrel file (re-exports everything)
    │
    └── tests/
        ├── setup.js                  # Test setup (configures Testing Library and MSW)
        ├── api/
        │   ├── auth.test.js          # Tests for auth API functions
        │   ├── todos.test.js         # Tests for todo API functions
        │   └── fetchWithAuth.test.js # Tests for the authenticated fetch helper
        ├── components/
        │   ├── LoginForm.test.jsx    # Tests for the login form
        │   └── RegisterForm.test.jsx # Tests for the registration form
        └── context/
            └── AuthContext.test.jsx  # Tests for the auth context
```

### What Each Folder Does

| Folder | Contents |
|---|---|
| `src/api/` | **Bridge to the backend** — functions that make HTTP requests to the server |
| `src/components/` | **Building blocks** — reusable UI pieces like buttons, forms, and todo rows |
| `src/context/` | **Shared state** — makes authentication data (who is logged in) available everywhere |
| `src/tests/` | **Automated tests** — ensures the frontend works correctly |

---

## 🚀 Getting Started

### Prerequisites

Before you can run the frontend, you need:

1. **Node.js** (version 22 or higher) — [Download here](https://nodejs.org/)
2. A terminal / command prompt
3. The **backend server** must be running (see the [Backend README](../backend/README.md))

### Step-by-Step Setup

#### 1. Install Dependencies

Open a terminal in the `frontend` folder and run:

```bash
npm install
```

#### 2. Configure the API URL

Open the `.env` file in the `frontend` folder. It should contain:

```
VITE_API_URL=http://localhost:5000/api
```

> 🔧 This tells the frontend where to find the backend server.  
> If your backend is running on a different address (e.g., a remote server), change this URL accordingly.

#### 3. Start the Development Server

```bash
npm run dev
```

This will start Vite's development server. You'll see a message like:

```
  ➜  Local:   http://localhost:5173/
```

Open that URL in your browser — you should see the Todo App!

> ⚠️ **Important:** Make sure the backend server is also running on port 5000, or the app won't be able to save or load your todos.

---

## 📜 Available Scripts

| Command | What It Does |
|---|---|
| `npm run dev` | Starts the development server with hot module replacement (instant updates) |
| `npm run build` | Builds the app for production (optimized, minified files in the `dist/` folder) |
| `npm run preview` | Serves the production build locally to preview it |
| `npm run lint` | Checks the code for style and formatting issues |
| `npm test` | Runs all automated tests |
| `npm run test:watch` | Runs tests in watch mode (re-runs when files change) |

---

## ✨ Feature Tour

### 🔐 Authentication

When you first open the app, you'll see either a **Login** or **Register** screen. You can switch between them with a toggle button.

- **Register:** Create a new account with a username, email, and password.
- **Login:** Sign in with your email and password.

After logging in, you receive a security token that is stored in your browser. This token proves who you are on every subsequent request.

---

### 📝 The Todo List

Once logged in, you'll see:

1. A **header** with the TODO logo, a welcome message (your username), and a theme toggle (sun/moon icon).
2. An **input field** where you type new todos. Press Enter (or click the checkbox) to add.
3. The **list of your todos**, each showing:
   - A circular checkbox (tap to mark as done)
   - The todo text (struck through when completed)
   - An X button to delete
4. A **footer** showing:
   - How many items are left to do
   - Filter buttons: **All** / **Active** / **Completed**
   - A "Clear Completed" button to remove all done items at once

---

### 🎯 Drag & Drop Reordering

You can **drag and drop** any todo to a new position in the list. Just click and hold a todo, then move it up or down. The new order is saved automatically to the backend.

---

### 🌙 Light & Dark Mode

Click the sun or moon icon in the top-right corner to switch between light and dark themes. Your preference is saved in your browser and will be remembered the next time you visit.

---

### 📱 Responsive Design

The app works beautifully on all screen sizes:

| Device | Experience |
|---|---|
| **Desktop** (≥768px) | Full layout with filter buttons in the footer |
| **Mobile** (<768px) | Filter buttons appear in a separate row below the list |

Different background images are used for mobile and desktop to ensure the best visual experience.

---

## 🔗 How the Frontend Talks to the Backend

The frontend communicates with the backend using **HTTP requests** — the same protocol your browser uses to load websites. Here is how the conversation works:

```
┌────────────────┐          HTTP Request           ┌────────────────┐
│                │  ──────────────────────────────>  │                │
│   Frontend     │                                   │    Backend     │
│  (Browser)     │  <──────────────────────────────  │   (Server)     │
│                │          HTTP Response            │                │
└────────────────┘                                   └────────────────┘
```

### Example — Adding a Todo

1. You type "Buy milk" in the input field and press Enter.
2. The frontend creates an HTTP `POST` request to `http://localhost:5000/api/todos` with the text `"Buy milk"` and your auth token.
3. The backend receives the request, saves the todo in the database, and sends back the saved todo (with its new ID and position).
4. The frontend receives the response and adds the new todo to the list on your screen.

### The `fetchWithAuth` Helper

Most requests include an **authorization token** (a security string stored in your browser). The `fetchWithAuth` helper automatically:

- Reads the token from your browser's local storage
- Attaches it to every request in the `Authorization` header
- Detects if the token is expired or invalid (HTTP 401 response) and logs you out

This keeps the code clean and secure.

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | The base URL of the backend API (e.g., `http://localhost:5000/api`) | ✅ Yes |
| `PORT` | The port the backend is running on (used for reference) | ❌ No |

> 💡 All environment variables that start with `VITE_` are exposed to the browser. Never store secrets or passwords here!

---

## 🧪 Testing

This project uses **Vitest** (a fast test runner) and **Testing Library** (for simulating user interactions). Tests are located in the `src/tests/` folder.

```bash
npm test
```

### What Gets Tested

| Test File | What It Tests |
|---|---|
| `api/auth.test.js` | That the register and login API functions send the right data |
| `api/todos.test.js` | That the todo CRUD functions send the right requests |
| `api/fetchWithAuth.test.js` | That the auth helper attaches tokens and handles 401 errors |
| `components/LoginForm.test.jsx` | That the login form validates input and submits correctly |
| `components/RegisterForm.test.jsx` | That the registration form works correctly |
| `context/AuthContext.test.jsx` | That login, logout, and user state work as expected |

Tests use **MSW (Mock Service Worker)** to intercept network requests, so no backend server is needed during testing.

---

## 🎨 Styling & Design

### Design Reference

The visual design of this app was inspired by the [Frontend Mentor "Todo App" challenge](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW). A detailed style guide (colors, fonts, layout breakpoints) is available in the `style-guide.md` file.

### Typography

- **Font:** [Josefin Sans](https://fonts.google.com/specimen/Josefin+Sans) — a clean, modern font
- **Weights:** 400 (regular) and 700 (bold)
- **Base size:** 18px

### Color System

The app uses CSS custom properties (variables) to manage colors. This makes theming easy:

| Theme | Background | Card | Text |
|---|---|---|---|
| **Light** | Near-white (`hsl(0, 0%, 98%)`) | White | Dark navy (`hsl(235, 19%, 35%)`) |
| **Dark** | Very dark navy (`hsl(235, 21%, 11%)`) | Dark navy (`hsl(235, 24%, 19%)`) | Pale purple (`hsl(236, 33%, 92%)`) |

### Background Images

Four background images are used to create the signature Todo App look:

- `bg-desktop-light.jpg` — Light theme background on desktop
- `bg-desktop-dark.jpg` — Dark theme background on desktop
- `bg-mobile-light.jpg` — Light theme background on mobile
- `bg-mobile-dark.jpg` — Dark theme background on mobile

### Drag Shadow

When dragging a todo, a prominent shadow appears to give visual feedback. The shadow is subtle in light mode and more dramatic in dark mode:

```css
/* Light mode */
--drag-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Dark mode */
--drag-shadow: 0 0 40px 8px rgba(0, 0, 0, 0.9);
```

---

## ☁️ Deployment Notes

When deploying the frontend to production:

1. **Build the project:** Run `npm run build` to create an optimized `dist/` folder.
2. **Host the `dist/` folder** on any static hosting service:
   - [Vercel](https://vercel.com/) (recommended — push your repo and it auto-deploys)
   - [Netlify](https://www.netlify.com/)
   - [GitHub Pages](https://pages.github.com/)
   - Any web server (Apache, Nginx, etc.)
3. **Update `VITE_API_URL`** to point to your production backend URL.
4. **Make sure the backend accepts requests** from your frontend domain (CORS configuration).

### Vercel

This project already includes a `.vercel` configuration folder. To deploy on Vercel:

```bash
npm run build
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments on every push.

---

## 📄 License

This project is for personal and educational use.

---

*Built with ❤️ using React, Vite, and Tailwind CSS.*
