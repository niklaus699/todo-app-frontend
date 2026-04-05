export const fetchWithAuth = async (url, options = {}, logout) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }

  return res;
};
