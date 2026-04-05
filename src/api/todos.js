// const PORT = import.meta.env.PORT;
import { fetchWithAuth } from "./fetchWithAuth";

const API_URL = import.meta.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};


export const fetchTodos = async (logout) => {
  const res = await fetchWithAuth(`${API_URL}/todos`, {}, logout);
  return res.json();
};

export const createTodo = async (text, logout) => {
  const res = await fetchWithAuth(
    `${API_URL}/todos`,
    {
      method: "POST",
      body: JSON.stringify({ text }),
    },
    logout
  )
  return res.json();
};
export const toggleTodo = async (id) => {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method : "PUT",
    headers : getAuthHeaders(),
  });
  if (!res.ok) throw new Error ("Failed to update todo");
  return res.json();
};

export const deleteTodo = async (id, logout) => {
  await fetchWithAuth(`${API_URL}/todos/${id}`, { method: "DELETE" }, logout);
};

export const reorderTodos = async (list) => {
    const res = await fetch(`${API_URL}/todos/reorder`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        orderedIds: list.map((t) => t.id),
      }),
    });
    if(!res.ok) {
      throw new Error("Failed to Reorder Rolling Back")
    };
  } 

    
