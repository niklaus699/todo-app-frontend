import { React, useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import useWindowWidth from "./components/useWindowWidth";
import AuthSwitch from "./components/AuthSwitch";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const Auth = ({ onAuthSuccess }) => {
  const width = useWindowWidth();
  const [mode, setMode] = useState("register");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const isMobile = width < 768;

  const images = {
    mobileLight: "url('/images/bg-mobile-light.jpg')",
    mobileDark: "url('/images/bg-mobile-dark.jpg')",
    desktopLight: "url('/images/bg-desktop-light.jpg')",
    desktopDark: "url('/images/bg-desktop-dark.jpg')",
  };

  const toggleTheme = () => {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t);
    localStorage.setItem("theme", t);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="bg-cover bg-center h-60 w-full py-8"
        style={{
          backgroundImage: isMobile
            ? theme === "light"
              ? images.mobileLight
              : images.mobileDark
            : theme === "light"
            ? images.desktopLight
            : images.desktopDark,
        }}
      >
        <div className="flex justify-between px-4 max-w-md mx-auto">
          <h1 className="text-white text-3xl tracking-[0.4em]">TODO</h1>
          <button onClick={toggleTheme}>
            {theme === "light" ? (
              <MoonIcon className="w-6 h-6 text-white" />
            ) : (
              <SunIcon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        <main className="card w-full mx-auto mt-10 p-6 space-y-6 md:max-w-xl">
          <AuthSwitch mode={mode} setMode={setMode} />

          {mode === "register" ? (
            <RegisterForm onSuccess={onAuthSuccess} />
          ) : (
            <LoginForm onSuccess={onAuthSuccess} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Auth;
