import { useState } from "react";
import { registerUser } from "../api/auth";
import ErrorMessage from "./ErrorMessage";


const RegisterForm = ({ onSuccess }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // ✅ Fix: include username in the payload
      const data = await registerUser({ username: userName, email, password });
      localStorage.setItem("token", data.token);
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        className="w-full pl-3 pr-3 py-2 bg-transparent placeholder:text-[var(--color-primary)] text-[var(--color-primary)]  text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="email"
        className="w-full pl-3 pr-3 py-2 bg-transparent placeholder:text-[var(--color-primary)] text-[var(--color-primary)]  text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full pl-3 pr-3 py-2 bg-transparent placeholder:text-[var(--color-primary)] text-[var(--color-primary)]  text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <ErrorMessage message={error} />}

      <button className="w-full bg-linear-to-r from-gradient-blue to-gradient-violet hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-[#0f1419]/50 font-bold leading-5 rounded-xl text-sm px-4 py-2.5 text-center text-white dark:focus:ring-[#24292F]/55">
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;
