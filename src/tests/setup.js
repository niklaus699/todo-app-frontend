import "@testing-library/jest-dom/vitest";

// ---------------------------------------------------------------------------
// Global test setup – runs before every test
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
