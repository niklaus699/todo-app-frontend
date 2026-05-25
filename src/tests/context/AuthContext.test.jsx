// ---------------------------------------------------------------------------
// Context tests – AuthContext + useAuth
// ---------------------------------------------------------------------------

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../../context/AuthContext";
import { useAuth } from "../../context/useAuth";
import React from "react";

beforeEach(() => {
  localStorage.clear();
});

// ===========================================================================

describe("AuthContext", () => {
  it("should initialise user from localStorage", () => {
    localStorage.setItem("token", "stored-token");
    localStorage.setItem("user", JSON.stringify({ id: "1", username: "test" }));

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual({ id: "1", username: "test" });
    expect(result.current.token).toBe("stored-token");
  });

  it("should initialise with null when localStorage is empty", () => {
    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it("login() should set user, token, and persist to localStorage", () => {
    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login({
        user: { id: "abc", username: "jane", email: "jane@example.com" },
        token: "jwt-123",
      });
    });

    expect(result.current.user).toEqual({
      id: "abc",
      username: "jane",
      email: "jane@example.com",
    });
    expect(result.current.token).toBe("jwt-123");
    expect(localStorage.getItem("token")).toBe("jwt-123");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual({
      id: "abc",
      username: "jane",
      email: "jane@example.com",
    });
  });

  it("logout() should clear user, token, and localStorage", () => {
    localStorage.setItem("token", "old-token");
    localStorage.setItem("user", JSON.stringify({ id: "1" }));

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Should have loaded from localStorage
    expect(result.current.token).toBe("old-token");

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("should handle login with empty user object", () => {
    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login({ user: null, token: "" });
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBe("");
    expect(localStorage.getItem("token")).toBe("");
  });

  it("should handle rapid login / logout sequence", () => {
    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login({ user: { id: "1" }, token: "t1" });
    });
    act(() => {
      result.current.logout();
    });
    act(() => {
      result.current.login({ user: { id: "2" }, token: "t2" });
    });

    expect(result.current.token).toBe("t2");
    expect(result.current.user).toEqual({ id: "2" });
    expect(localStorage.getItem("token")).toBe("t2");
  });
});
