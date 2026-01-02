function TodoListItem({ todo, onCompleteTodo}) {
  return (
    <li>
      <form id={todo.id}>
        <input
          type="checkbox"
          name="item"
          checked={todo.isCompleted}
          onChange={() => onCompleteTodo(todo.id)}
        />
        {todo.title}
      </form>
    </li>
  );
}

export default TodoListItem;