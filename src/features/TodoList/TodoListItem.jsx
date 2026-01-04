import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }
  function handleUpdate(event) {
      if(isEditing === false) {
        return;
      } 
      event.preventDefault();
      onUpdateTodo({
        ...todo,
        title: workingTitle,
      });
      setIsEditing(false);
  }
  function handleEdit(event) {
    event.preventDefault();
    setWorkingTitle(event.target.value)
  }
  handleEdit
  return (
    <li>
      <form id={todo.id}>
        {isEditing ? (
          <>
            <TextInputWithLabel 
              value={workingTitle} 
              onChange={handleEdit}
            />
            <input type="button" value="Cancel" onClick={handleCancel} />
            <input type="button" value="Update" onClick={handleUpdate} />
          </>
        ) : (
          <>
            <input
              type="checkbox"
              name="item"
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;