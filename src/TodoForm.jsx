import { useRef } from "react";

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  function handleAddTodo(event) {
    event.preventDefault();
    const title = event.target.title.value;
    onAddTodo(title);
    event.target.title.value = '';
    todoTitleInput.current.focus();
  }
  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo1</label>
      <input
        ref={todoTitleInput}
        type="text"
        id="todoTitle"
        name="title"
        placeholder="add a title"
      />
      <input type="submit" value="Add Todo" />
    </form>
  );
}

export default TodoForm;
