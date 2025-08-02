import { useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import TodoFilter from "./components/TodoFilter";

export interface ToDo {
  text: string;
  completed: boolean;
  id: number;
}
const App = () => {
  const [todos, setTodos] = useState<Array<ToDo>>([]);
  const [filter, setFilter] = useState("");

  const addTodo = (text: string) => {
    setTodos([...todos, { text, completed: false, id: Date.now() }]);
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (id: number) => {
    const remainingTodos = todos.filter((todo) => todo.id !== id);
    setTodos(remainingTodos);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const clearCompleted = () => {
    const activeTodos = todos.filter((todo) => !todo.completed);
    setTodos(activeTodos);
  };

  return (
    <div className="app">
      <h1>Todo App</h1>

      <TodoForm onAdd={addTodo} />

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />

      <TodoFilter
        filter={filter}
        onClearCompleted={clearCompleted}
        onFilter={setFilter}
      />
    </div>
  );
};

export default App;
