"use client";

interface TodoData {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: TodoData;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const createdDate = new Date(todo.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className={`todo-item${todo.completed ? " completed" : ""}`}>
      <button
        className="todo-checkbox"
        onClick={() => onToggle(todo.id, !todo.completed)}
        title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed && (
          <svg className="todo-checkbox-check" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="todo-content">
        <div
          className="todo-title"
          onClick={() => onToggle(todo.id, !todo.completed)}
        >
          {todo.title}
        </div>
        {todo.description && (
          <div className="todo-description">{todo.description}</div>
        )}
        <div className="todo-meta">Added {createdDate}</div>
      </div>

      <div className="todo-actions">
        <span className={`todo-badge ${todo.completed ? "done" : "pending"}`}>
          {todo.completed ? "Done" : "Pending"}
        </span>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(todo.id)}
          title="Delete todo"
          aria-label="Delete todo"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
