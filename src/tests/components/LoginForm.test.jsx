// ---------------------------------------------------------------------------
// Component tests – LoginForm
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthContext } from "../../context/AuthContext";
import LoginForm from "../../components/LoginForm";

// Mock the auth API module
vi.mock("../../api/auth.js", () => ({
  loginUser: vi.fn(),
}));

const { loginUser } = await import("../../api/auth.js");

function renderLoginForm({ onSuccess = vi.fn(), login = vi.fn() } = {}) {
  return render(
    <AuthContext.Provider value={{ login, user: null, token: null, logout: vi.fn() }}>
      <LoginForm onSuccess={onSuccess} />
    </AuthContext.Provider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ===========================================================================

describe("LoginForm", () => {
  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------

  it("should render email and password inputs and login button", () => {
    renderLoginForm();

    expect(screen.getByPlaceholderText("Enter Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Successful login
  // -----------------------------------------------------------------------

  it("should call loginUser, login(), and onSuccess on success", async () => {
    const onSuccess = vi.fn();
    const login = vi.fn();

    loginUser.mockResolvedValueOnce({
      user: { id: "1", username: "jane", email: "jane@example.com" },
      token: "jwt-token",
    });

    renderLoginForm({ onSuccess, login });

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Enter Email"), "jane@example.com");
    await user.type(screen.getByPlaceholderText("Enter Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "jane@example.com",
        password: "secret123",
      });
    });

    expect(login).toHaveBeenCalledWith({
      user: { id: "1", username: "jane", email: "jane@example.com" },
      token: "jwt-token",
    });
    expect(localStorage.getItem("token")).toBe("jwt-token");
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  // -----------------------------------------------------------------------
  // Error handling
  // -----------------------------------------------------------------------

  it("should show error message on login failure", async () => {
    loginUser.mockRejectedValueOnce(new Error("Invalid credentials"));

    renderLoginForm();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Enter Email"), "bad@example.com");
    await user.type(screen.getByPlaceholderText("Enter Password"), "wrong");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("should show network error message", async () => {
    loginUser.mockRejectedValueOnce(new Error("Failed to fetch"));

    renderLoginForm();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Enter Email"), "eve@example.com");
    await user.type(screen.getByPlaceholderText("Enter Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------

  it("should clear previous error on retry", async () => {
    loginUser
      .mockRejectedValueOnce(new Error("Invalid credentials"))
      .mockResolvedValueOnce({
        user: { id: "1", username: "jane", email: "jane@example.com" },
        token: "new-token",
      });

    renderLoginForm();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Enter Email"), "bad@example.com");
    await user.type(screen.getByPlaceholderText("Enter Password"), "wrong");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    // Fix credentials and retry
    await user.clear(screen.getByPlaceholderText("Enter Email"));
    await user.clear(screen.getByPlaceholderText("Enter Password"));
    await user.type(screen.getByPlaceholderText("Enter Email"), "good@example.com");
    await user.type(screen.getByPlaceholderText("Enter Password"), "correct");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
    });
  });

  it("should not crash when onSuccess is undefined", async () => {
    loginUser.mockResolvedValueOnce({
      user: { id: "1", username: "jane", email: "jane@example.com" },
      token: "jwt-token",
    });

    renderLoginForm({ onSuccess: undefined });

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Enter Email"), "jane@example.com");
    await user.type(screen.getByPlaceholderText("Enter Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    // Should not throw — the typeof guard in LoginForm handles this
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalled();
    });
  });
});
