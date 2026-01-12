import { useState, useRef } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

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
      <TextInputWithLabel
        elementId={"todoTitle"}
        label={"Todo"}
        ref={todoTitleInput}
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
