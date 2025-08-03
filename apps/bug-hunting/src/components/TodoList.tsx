import { ToDo } from "../App";

interface Props {
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  todos: Array<ToDo>;
}
const TodoList = ({ todos = [], onToggle, onDelete }: Props) => {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`todo-item ${todo.completed ? "completed" : ""}`}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span>{todo.text}</span>
          <button className="delete-btn" onClick={() => onDelete(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
