import { useState, useRef } from "react";
import styled from 'styled-components';
import TextInputWithLabel from "../shared/TextInputWithLabel";

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;

  label {
    font-size: 26px;
    font-weight: 800;
    color: var(--muted);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    .addForm label {
      font-size: 18px;
    }
  }
`;

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
    <StyledForm onSubmit={handleAddTodo}>
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
    </StyledForm>
  );
}

export default TodoForm;
