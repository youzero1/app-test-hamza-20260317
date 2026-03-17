import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <main>
      <div className="container">
        <div className="header">
          <h1>✅ Todo App</h1>
          <p>Stay organized, get things done.</p>
        </div>
        <TodoList />
      </div>
    </main>
  );
}
