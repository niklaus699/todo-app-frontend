import { React, useEffect, useState } from "react";
import Row from "./components/Row.jsx";
import { useAuth } from "@/context";
import Auth from "./Auth.jsx";
import {
  fetchTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  reorderTodos,
} from "./api/todos.js";
import useWindowWidth from "./components/useWindowWidth.jsx";
import { SunIcon, MoonIcon, Bars4Icon } from "@heroicons/react/24/solid";
import FilterButton from "./components/FilterButton.jsx";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CheckboxButton } from "./components/CheckboxButton.jsx";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [shouldAdd, setShouldAdd] = useState(false);
  const [timer, setTimer] = useState(null);
  const [filter, setFilter] = useState("all");
  const width = useWindowWidth();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const { user, loading, logout } = useAuth();


  const isMobile = width < 768;
  const isDesktop = width >= 768;

  // Add todo logic
  const addTodo = async () => {
    try {
      if (!newTodo.trim() || newTodo.length > 40) {
        setShouldAdd(false);
        return;
      }
      const created = await createTodo(newTodo, logout);
      setTodos((prev) => [created, ...prev]);
      setNewTodo("");
      setShouldAdd(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClick = () => {
    if (!newTodo.trim()) {
      return;
    }
    setShouldAdd(true);

    if (timer) {
      clearTimeout(timer);
    }
    const t = setTimeout(() => {
      addTodo();
    }, 300);
    setTimer(t);
  };

  const toggle = async (id) => {
    try {
      const updated = await toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // delete functionality
  const remove = async (id) => {
    try {
      await deleteTodo(id, logout);
      setTodos((prev) =>
        prev.filter((t) => {
          return id !== t.id;
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  // clear completed todos logic
  // const delay = (ms) => new Promise((res) => setTimeout((res, ms)));
  const clearCompleted = async () => {
    try {
      const completedTodos = todos.filter((t) => t.completed);
      if (!completedTodos.length) return;

      await Promise.all(completedTodos.map((t) => deleteTodo(t.id, logout)));

      setTodos((prev) => prev.filter((t) => !t.completed));
    } catch (error) {
      console.error("Failed to clear completed todos:", error);
    }
  };

  const filtered = todos.filter((todo) => {
    return filter === "all"
      ? true
      : filter === "active"
      ? !todo.completed
      : todo.completed;
  });

  const changeFilter = (action) => setFilter(action);

  const itemsLeft = todos.filter((todo) => {
    return !todo.completed;
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
      distance: 8, // must move 8px before drag starts
  },
    }),
    useSensor(TouchSensor, {
      // fixes touch responsiveness
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTodoPos = (id) => {
    return todos.findIndex((todo) => {
      return todo.id === id;
    });
  };

  const handleDragEnd = async (e) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const snapshot = todos;
    const originalPos = getTodoPos(active.id);
    const newPos = getTodoPos(over.id);
    const reorderedList = arrayMove(todos, originalPos, newPos);
    setTodos(reorderedList);

    try {
      await reorderTodos(reorderedList);
    } catch (error) {
      console.error(error);
      setTodos(snapshot);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const images = {
    mobileLight: "url('/images/bg-mobile-light.jpg')",
    mobileDark: "url('/images/bg-mobile-dark.jpg')",
    desktopLight: "url('/images/bg-desktop-light.jpg')",
    desktopDark: "url('/images/bg-desktop-dark.jpg')",
  };

  const getImage = (imageLight, imageDark) => {
    return theme === "light" ? imageLight : imageDark;
  };

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Load todos
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos(logout);
        setTodos(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadTodos();
  }, []);
  if (loading) return null;
  if (!user) return <Auth />;

  return (
    <div className="flex flex-col items-center bg-gray-200 transition-colors duration-300">
      <div
        className="flex flex-col bg-cover bg-center p-6 h-60 items-center w-full"
        style={{
          backgroundImage: isMobile
            ? getImage(images.mobileLight, images.mobileDark)
            : getImage(images.desktopLight, images.desktopDark),
        }}
      >
        <div className="flex justify-between w-full max-w-md items-center md:max-w-xl">
          <div className="flex flex-col">
            <span className="text-gray-50 text-3xl tracking-[0.4em] font-semibold">
              TODO
            </span>
            <span className="text-white opacity-75 text-sm font-medium tracking-wide mt-1">
              Welcome, {user.username} 👋
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="cursor-pointer" onClick={toggleTheme}>
              {theme === "light" ? (
                <MoonIcon className="w-6 h-6 cursor-pointer text-white" />
              ) : (
                <SunIcon className="w-6 h-6 cursor-pointer text-white" />
              )}
            </div>
          </div>
        </div>
        <form
          className="flex justify-start items-center space-x-6 mt-9 max-w-md w-full rounded-md shadow-lg outline-none px-4 py-2 bg-card md:max-w-xl"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddClick();
          }}
        >
          <CheckboxButton condition={shouldAdd} type="submit" />

          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Create a new todo..."
            className="font-sans w-full p-2 text-[var(--color-primary)] placeholder:text-[var(--color-primary)] "
          />
        </form>
        <main className="card shadow-2xl flex flex-col rounded-md max-w-md px-3 mt-6 w-full drag-shadow md:max-w-xl">
          <div>
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCorners}
              /* onDragEnd later to reorder */
            >
              <SortableContext
                items={filtered.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {filtered.map((todo) => (
                  <Row
                    key={todo.id}
                    handleToggle={() => toggle(todo.id)}
                    isCompleted={todo.completed}
                    textContent={todo.text}
                    todoId={todo.id}
                    handleRemove={() => remove(todo.id)}
                    dragIcon={<Bars4Icon className="w-6 h-6" />}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          {/* footer section */}
          <div className="flex justify-between items-center py-3 font-sans">
            <span className="text-[var(--color-primary)] cursor-pointer md:text-sm">
              {" "}
              {itemsLeft.length} items left
            </span>

            {isDesktop && (
              <div className="flex justify-between space-x-3">
                {["all", "active", "completed"].map((actionName, idx) => {
                  return (
                    <FilterButton
                      key={idx}
                      filter={filter}
                      handleChangeFilter={() => changeFilter(actionName)}
                      actionName={actionName}
                    />
                  );
                })}
              </div>
            )}

            <button onClick={clearCompleted}>
              <span className="cursor-pointer text-[var(--color-secondary)] hover:text-[var(--color-primary)]">
                Clear Completed
              </span>
            </button>
          </div>
        </main>

        {isMobile && (
          <div className="card shadow-xl w-full max-w-md flex justify-center space-x-6 mt-6 py-3 rounded-md bg-card drag-shadow">
            {["all", "active", "completed"].map((actionName, idx) => {
              return (
                <FilterButton
                  key={idx}
                  filter={filter}
                  handleChangeFilter={() => changeFilter(actionName)}
                  actionName={actionName}
                />
              );
            })}
          </div>
        )}
        
        <div className="w-full max-w-md md:max-w-xl flex flex-col sm:flex-row sm:justify-between items-center py-6 gap-3">
          <p className="text-sm font-sans font-semibold text-[var(--color-secondary)] hover:text-[var(--color-primary)]">
            Drag and drop to reorder list
          </p>
          <button
            onClick={logout}
            className="w-full sm:w-auto text-center text-[var(--color-primary)] text-sm font-semibold opacity-75 hover:opacity-100 transition-opacity border border-white/30 rounded-md px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
