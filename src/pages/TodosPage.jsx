import '../App.css';
import styles from '../App.module.css';

import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage({
  addTodo,
  todoState,
  completeTodo,
  updateTodo,
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const filteredTodoList = todoState.todoList.filter(
      (item) => item.isCompleted === false
    );
  
  return (
    <>
      <section className={styles.panel}>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      </section>
      <section className={styles.panel}>
        <TodoList
          todoList={filteredTodoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
        />
      </section>
      <section className={styles.panel}>
        <TodosViewForm
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          sortField={sortField}
          setSortField={setSortField}
          queryString={queryString}
          setQueryString={setQueryString}
        />
      </section>
    </>
  );
}

export default TodosPage;
