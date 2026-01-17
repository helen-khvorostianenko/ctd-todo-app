import TodoListItem from './TodoListItem';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading}) {
  const isEmpty = !todoList.length;
  if (isEmpty && isLoading) {
    return <p>Todo list loading...</p>;
  }

  if (isEmpty) {
    return <p>Add todo above to get started</p>;
  }
  return (
    <ul>
      {todoList.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
