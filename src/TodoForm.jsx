import { useState, useRef } from "react";

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  }
  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        ref={todoTitleInput}
        type="text"
        id="todoTitle"
        name="title"
        placeholder="add a title"
        value={workingTodoTitle}
        onChange={(event) => {
          setWorkingTodoTitle(event.target.value);
        }}
      />
      <input type="submit" value="Add Todo" disabled={!workingTodoTitle} />
    </form>
  );
}

export default TodoForm;
