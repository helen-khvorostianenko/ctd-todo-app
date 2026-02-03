import { useState, useEffect } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  useEffect(() => {
    setWorkingTitle(todo.title)
  }, [todo]);

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
    console.log(event.target.value)
    setWorkingTitle(event.target.value)
  }
  return (
    <li className="todoItem">
      <form
        className={isEditing ? 'todoItemForm isEditing' : 'todoItemForm'}
        id={todo.id}
      >
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todo-title-${todo.id}`}
              value={workingTitle}
              onChange={handleEdit}
            />
            <div className="todoItemActions">
              <input
                className="btn btnGhost"
                type="button"
                value="Cancel"
                onClick={handleCancel}
              />
              <input
                className="btn btnPrimary"
                type="button"
                value="Update"
                onClick={handleUpdate}
              />
            </div>
          </>
        ) : (
          <>
            <input
              className="todoCheckbox"
              type="checkbox"
              name="item"
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
            <span className="todoText" onClick={() => setIsEditing(true)}>
              {todo.title}
            </span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;