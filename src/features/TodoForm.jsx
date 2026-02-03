import { useState, useRef } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo, isSaving }) {
  const todoTitleInput = useRef('');
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  }
  return (
    <form className="addForm" onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId={'todoTitle'}
        label={'+ Todo'}
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => {
          setWorkingTodoTitle(event.target.value);
        }}
      />
      <button
        className="btn btnPrimary"
        disabled={workingTodoTitle.trim() === ''}
      >
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
}

export default TodoForm;
