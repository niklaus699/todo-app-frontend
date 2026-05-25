// ---------------------------------------------------------------------------
// API layer unit tests – auth.js
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the global fetch before importing the module under test
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Dynamic import so the mock is in place first
const { registerUser, loginUser } = await import("../../api/auth.js");

beforeEach(() => {
  mockFetch.mockReset();
});

// ===========================================================================
// registerUser
// ===========================================================================

describe("registerUser", () => {
  it("should POST to /auth/register with JSON body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: "abc", username: "alice", email: "alice@example.com" },
        token: "jwt-token-123",
      }),
    });

    const result = await registerUser({
      username: "alice",
      email: "alice@example.com",
      password: "secret",
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/auth/register");
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(options.body)).toEqual({
      username: "alice",
      email: "alice@example.com",
      password: "secret",
    });
    expect(result).toEqual({
      user: { id: "abc", username: "alice", email: "alice@example.com" },
      token: "jwt-token-123",
    });
  });

  it("should throw server error message when !ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ message: "User already exists" }),
    });

    await expect(
      registerUser({
        username: "bob",
        email: "bob@example.com",
        password: "secret",
      }),
    ).rejects.toThrow("User already exists");
  });

  it("should throw default message when server returns no message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(
      registerUser({
        username: "bob",
        email: "bob@example.com",
        password: "secret",
      }),
    ).rejects.toThrow("Registration failed");
  });

  it("should throw when fetch itself rejects (network error)", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(
      registerUser({
        username: "bob",
        email: "bob@example.com",
        password: "secret",
      }),
    ).rejects.toThrow("Failed to fetch");
  });
});

// ===========================================================================
// loginUser
// ===========================================================================

describe("loginUser", () => {
  it("should POST to /auth/login with email + password", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: "xyz", username: "eve", email: "eve@example.com" },
        token: "jwt-token-456",
      }),
    });

    const result = await loginUser({
      email: "eve@example.com",
      password: "secret",
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/auth/login");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({
      email: "eve@example.com",
      password: "secret",
    });
    expect(result).toHaveProperty("token", "jwt-token-456");
  });

  it("should throw server error message on 401", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid credentials" }),
    });

    await expect(
      loginUser({ email: "bad@example.com", password: "wrong" }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("should throw default message when server returns no body on error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(
      loginUser({ email: "eve@example.com", password: "secret" }),
    ).rejects.toThrow("Login failed");
  });

  it("should throw on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Network error"));

    await expect(
      loginUser({ email: "eve@example.com", password: "secret" }),
    ).rejects.toThrow("Network error");
  });
});
