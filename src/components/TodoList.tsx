"use client";

import { useState, useEffect, useCallback } from "react";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data: Todo[] = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      setError("Failed to load todos. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (title: string, description: string) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: description || undefined })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create todo");
    }
    const newTodo: Todo = await res.json();
    setTodos(prev => [newTodo, ...prev]);
  };

  const handleToggle = async (id: number, completed: boolean) => {
    // Optimistic update
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed } : t))
    );
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed })
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated: Todo = await res.json();
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch {
      // Revert on error
      setTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, completed: !completed } : t))
      );
      setError("Failed to update todo. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    // Optimistic update
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    } catch {
      // Revert on error
      fetchTodos();
      setError("Failed to delete todo. Please try again.");
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div>
      <AddTodoForm onAdd={handleAdd} />

      {error && (
        <div className="error-banner">
          <span>⚠️</span> {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "1rem" }}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {!loading && todos.length > 0 && (
        <div className="stats-bar">
          <div className="stat">
            <span>Total:</span>
            <span className="stat-value">{todos.length}</span>
          </div>
          <div className="stat">
            <span>Pending:</span>
            <span className="stat-value" style={{ color: "#3b82f6" }}>{pendingCount}</span>
          </div>
          <div className="stat">
            <span>Completed:</span>
            <span className="stat-value" style={{ color: "#22c55e" }}>{completedCount}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading todos...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No todos yet</h3>
          <p>Add your first todo above to get started!</p>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
