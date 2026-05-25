// ---------------------------------------------------------------------------
// API layer unit tests – fetchWithAuth.js
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const mockLogout = vi.fn();

const { fetchWithAuth } = await import("../../api/fetchWithAuth.js");

beforeEach(() => {
  mockFetch.mockReset();
  mockLogout.mockReset();
  localStorage.clear();
});

// ===========================================================================

describe("fetchWithAuth", () => {
  // -----------------------------------------------------------------------
  // Token present
  // -----------------------------------------------------------------------

  it("should attach Bearer token when stored in localStorage", async () => {
    localStorage.setItem("token", "my-jwt-token");
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

    await fetchWithAuth("http://localhost:5000/api/todos", {}, mockLogout);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer my-jwt-token");
    expect(options.headers["Content-Type"]).toBe("application/json");
  });

  // -----------------------------------------------------------------------
  // No token
  // -----------------------------------------------------------------------

  it("should NOT send Authorization header when no token", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

    await fetchWithAuth("http://localhost:5000/api/todos", {}, mockLogout);

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.headers["Content-Type"]).toBe("application/json");
  });

  // -----------------------------------------------------------------------
  // Merge custom headers
  // -----------------------------------------------------------------------

  it("should merge custom headers with defaults", async () => {
    localStorage.setItem("token", "abc");
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

    await fetchWithAuth(
      "http://localhost:5000/api/todos",
      {
        method: "POST",
        headers: { "X-Custom": "custom-value" },
        body: JSON.stringify({ text: "hi" }),
      },
      mockLogout,
    );

    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe("POST");
    expect(options.headers["X-Custom"]).toBe("custom-value");
    expect(options.headers.Authorization).toBe("Bearer abc");
    expect(options.body).toBe(JSON.stringify({ text: "hi" }));
  });

  // -----------------------------------------------------------------------
  // 401 → logout
  // -----------------------------------------------------------------------

  it("should call logout on 401 response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

    await expect(
      fetchWithAuth("http://localhost:5000/api/todos", {}, mockLogout),
    ).rejects.toThrow("Unauthorized");

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("should NOT call logout on non-401 errors", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    // fetchWithAuth doesn't throw on non-401, it just returns the response
    const res = await fetchWithAuth(
      "http://localhost:5000/api/todos",
      {},
      mockLogout,
    );
    expect(mockLogout).not.toHaveBeenCalled();
    expect(res.status).toBe(500);
  });

  // -----------------------------------------------------------------------
  // Options merging edge cases
  // -----------------------------------------------------------------------

  it("should default to GET when no method is provided", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

    await fetchWithAuth("http://localhost:5000/api/todos", {}, mockLogout);

    const [, options] = mockFetch.mock.calls[0];
    // fetch defaults method to undefined; the caller's option spread comes first
    expect(options.method).toBeUndefined();
  });

  it("should pass through custom Content-Type if provided", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

    await fetchWithAuth(
      "http://localhost:5000/api/upload",
      { headers: { "Content-Type": "multipart/form-data" } },
      mockLogout,
    );

    const [, options] = mockFetch.mock.calls[0];
    // Custom header should override the default application/json
    expect(options.headers["Content-Type"]).toBe("multipart/form-data");
  });
});
