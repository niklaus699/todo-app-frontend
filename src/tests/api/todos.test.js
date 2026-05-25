// ---------------------------------------------------------------------------
// API layer unit tests – todos.js
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const { fetchTodos, createTodo, toggleTodo, deleteTodo, reorderTodos } =
  await import("../../api/todos.js");

const noop = () => {};

beforeEach(() => {
  mockFetch.mockReset();
  localStorage.clear();
  localStorage.setItem("token", "test-token");
});

// ===========================================================================
// fetchTodos
// ===========================================================================

describe("fetchTodos", () => {
  it("should GET /todos with Bearer token", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, text: "Buy milk" }],
    });

    const result = await fetchTodos(noop);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/todos");
    expect(options.headers.Authorization).toBe("Bearer test-token");
    expect(result).toEqual([{ id: 1, text: "Buy milk" }]);
  });
});

// ===========================================================================
// createTodo
// ===========================================================================

describe("createTodo", () => {
  it("should POST /todos with text in JSON body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        text: "New task",
        completed: false,
        position: 0,
      }),
    });

    const result = await createTodo("New task", noop);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/todos");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer test-token");
    expect(JSON.parse(options.body)).toEqual({ text: "New task" });
    expect(result.text).toBe("New task");
  });
});

// ===========================================================================
// toggleTodo
// ===========================================================================

describe("toggleTodo", () => {
  it("should PUT /todos/:id with Bearer token", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 42, completed: true }),
    });

    const result = await toggleTodo(42);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/todos/42");
    expect(options.method).toBe("PUT");
    expect(options.headers.Authorization).toBe("Bearer test-token");
    expect(result.completed).toBe(true);
  });

  it("should throw on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: "Unable to update todo" }),
    });

    await expect(toggleTodo(999)).rejects.toThrow("Failed to update todo");
  });
});

// ===========================================================================
// deleteTodo
// ===========================================================================

describe("deleteTodo", () => {
  it("should DELETE /todos/:id", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 203 });

    await deleteTodo(7, noop);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/todos/7");
    expect(options.method).toBe("DELETE");
  });
});

// ===========================================================================
// reorderTodos
// ===========================================================================

describe("reorderTodos", () => {
  it("should PUT /todos/reorder with orderedIds", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const list = [
      { id: 3, text: "C" },
      { id: 1, text: "A" },
      { id: 2, text: "B" },
    ];

    await reorderTodos(list);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/todos/reorder");
    expect(options.method).toBe("PUT");
    expect(JSON.parse(options.body)).toEqual({ orderedIds: [3, 1, 2] });
  });

  it("should throw on failure", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(reorderTodos([{ id: 1 }])).rejects.toThrow(
      "Failed to Reorder Rolling Back",
    );
  });
});
