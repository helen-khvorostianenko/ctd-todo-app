import TodoListItem from './TodoListItem';

function TodoList({todoList, onCompleteTodo}) {
  const isEmpty = todoList.length == 0;
  return (
    <>
      {isEmpty ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {todoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;
