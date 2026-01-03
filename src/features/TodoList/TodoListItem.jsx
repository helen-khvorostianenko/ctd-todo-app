import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({ todo, onCompleteTodo}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li>
      <form id={todo.id}>
        {isEditing ? (
          <>
            <TextInputWithLabel value={todo.title} />
          </>
        ) : (
          <>
            <input
              type="checkbox"
              name="item"
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
            <span onClick={() => setIsEditing(true)}> 
              {todo.title}
            </span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;