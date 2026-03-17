"use client";

import { useState, FormEvent } from "react";

interface AddTodoFormProps {
  onAdd: (title: string, description: string) => Promise<void>;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Title is required.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onAdd(trimmed, description.trim());
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Failed to add todo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="add-form-card">
      <h2>Add New Todo</h2>
      {error && (
        <div className="error-banner">
          <span>⚠️</span> {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title <span style={{ color: "#ef4444" }}>*</span></label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={isSubmitting}
            maxLength={255}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add more details..."
            disabled={isSubmitting}
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "+ Add Todo"}
        </button>
      </form>
    </div>
  );
}
