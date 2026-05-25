export const fetchWithAuth = async (url, options = {}, logout) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Only attach Authorization header when a token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }

  return res;
};
