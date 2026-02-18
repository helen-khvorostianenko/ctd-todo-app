import { useEffect } from 'react';
import '../App.css';
import styles from '../App.module.css';

import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import { useNavigate, useSearchParams } from 'react-router';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 5;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage) || 1;

  const navigate = useNavigate();

  function handlePreviousPage() {
    const prevPage = Math.max(1, currentPage - 1);
    setSearchParams({ page: String(prevPage) });
  }

  function handleNextPage() {
    const nextPage = Math.min(totalPages, currentPage + 1);
    setSearchParams({ page: String(nextPage) });
  }

  const currentTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );
  
  useEffect(() => {
    if (currentPage < 1 || currentPage > totalPages || isNaN(currentPage)) {
      navigate('/');
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <>
      <section className={styles.panel}>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      </section>
      <section className={styles.panel}>
        <TodoList
          todoList={currentTodos}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
        />
      </section>
      <section>
        <div className={styles.paginationControls}>
          <button
            className="btn btnPrimary"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btnPrimary"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
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
