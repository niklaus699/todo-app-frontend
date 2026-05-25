// ---------------------------------------------------------------------------
// Component tests – RegisterForm
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthContext } from "../../context/AuthContext";
import RegisterForm from "../../components/RegisterForm";

vi.mock("../../api/auth.js", () => ({
  registerUser: vi.fn(),
}));

const { registerUser } = await import("../../api/auth.js");

function renderRegisterForm({ onSuccess = vi.fn(), login = vi.fn() } = {}) {
  return render(
    <AuthContext.Provider value={{ login, user: null, token: null, logout: vi.fn() }}>
      <RegisterForm onSuccess={onSuccess} />
    </AuthContext.Provider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

// ===========================================================================

describe("RegisterForm", () => {
  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------

  it("should render username, email, password inputs and button", () => {
    renderRegisterForm();

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Successful registration
  // -----------------------------------------------------------------------

  it("should call registerUser, login(), and onSuccess on success", async () => {
    const onSuccess = vi.fn();
    const login = vi.fn();

    registerUser.mockResolvedValueOnce({
      user: { id: "1", username: "alice", email: "alice@example.com" },
      token: "jwt-token-abc",
    });

    renderRegisterForm({ onSuccess, login });

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Username"), "alice");
    await user.type(
      screen.getByPlaceholderText("Enter Email"),
      "alice@example.com",
    );
    await user.type(screen.getByPlaceholderText("Your password"), "secret123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        username: "alice",
        email: "alice@example.com",
        password: "secret123",
      });
    });

    expect(login).toHaveBeenCalledWith({
      user: { id: "1", username: "alice", email: "alice@example.com" },
      token: "jwt-token-abc",
    });
    expect(localStorage.getItem("token")).toBe("jwt-token-abc");
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  // -----------------------------------------------------------------------
  // Error handling
  // -----------------------------------------------------------------------

  it("should show error message on duplicate user", async () => {
    registerUser.mockRejectedValueOnce(new Error("User already exists"));

    renderRegisterForm();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Username"), "alice");
    await user.type(
      screen.getByPlaceholderText("Enter Email"),
      "alice@example.com",
    );
    await user.type(screen.getByPlaceholderText("Your password"), "secret123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("User already exists")).toBeInTheDocument();
    });
  });

  it("should show error on missing fields (from server)", async () => {
    registerUser.mockRejectedValueOnce(new Error("Missing fields"));

    renderRegisterForm();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Enter Email"), "alice@example.com");
    await user.type(screen.getByPlaceholderText("Your password"), "secret123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Missing fields")).toBeInTheDocument();
    });
  });

  it("should show internal server error", async () => {
    registerUser.mockRejectedValueOnce(new Error("Internal server error"));

    renderRegisterForm();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Username"), "bob");
    await user.type(
      screen.getByPlaceholderText("Enter Email"),
      "bob@example.com",
    );
    await user.type(screen.getByPlaceholderText("Your password"), "secret123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Internal server error")).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------

  it("should not crash when onSuccess is undefined", async () => {
    registerUser.mockResolvedValueOnce({
      user: { id: "1", username: "alice", email: "alice@example.com" },
      token: "jwt-token",
    });

    renderRegisterForm({ onSuccess: undefined });

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Username"), "alice");
    await user.type(
      screen.getByPlaceholderText("Enter Email"),
      "alice@example.com",
    );
    await user.type(screen.getByPlaceholderText("Your password"), "secret123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Should not throw — the typeof guard handles undefined onSuccess
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
    });
  });

  it("should clear error on retry after failure", async () => {
    registerUser
      .mockRejectedValueOnce(new Error("User already exists"))
      .mockResolvedValueOnce({
        user: { id: "2", username: "bob", email: "bob2@example.com" },
        token: "token-2",
      });

    renderRegisterForm();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Username"), "bob");
    await user.type(
      screen.getByPlaceholderText("Enter Email"),
      "bob@example.com",
    );
    await user.type(screen.getByPlaceholderText("Your password"), "secret123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("User already exists")).toBeInTheDocument();
    });

    // Change email and retry
    await user.clear(screen.getByPlaceholderText("Enter Email"));
    await user.type(
      screen.getByPlaceholderText("Enter Email"),
      "bob2@example.com",
    );
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.queryByText("User already exists")).not.toBeInTheDocument();
    });
  });
});
