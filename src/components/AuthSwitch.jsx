const AuthSwitch = ({ mode, setMode }) => {
  return (
    <div className="flex card rounded-full p-1 max-w-xs">
      {["login", "register"].map((item) => (
        <button
          key={item}
          onClick={() => setMode(item)}
          className={`
            px-6 py-2 rounded-full text-sm font-semibold transition-all
            ${
              mode === item
                ? "bg-[var(--color-primary)] text-[var(--bg-card)] shadow-lg scale-105"
                : "text-[var(--color-primary)]"
            }
          `}
        >
          {item === "login" ? "Login" : "Register"}
        </button>
      ))}
    </div>
  );
};

export default AuthSwitch;
