import './App.css';
import styles from './App.module.css';
import logo from './assets/todo-list-svgrepo-com.svg';
import { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import TodosPage from './pages/TodosPage';
import { airtableUrl, airtableToken } from './api/airtableConfig';
import { createAirtableClient } from './api/airtableClient';
import {
  reducer as todoReducer,
  actions as todoActions,
  initialState as initialTodoState,
  actions,
} from './reducers/todos.reducer';

function App() {
  // State for managing todo list and UI state
  const [todoState, dispatchTodoActions] = useReducer(
    todoReducer,
    initialTodoState
  );

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString?.trim()) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${airtableUrl}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  const airtable = useMemo(() => {
    return createAirtableClient({
      url: encodeUrl(),
      token: airtableToken,
    });
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatchTodoActions({ type: todoActions.fetchTodos });
      try {
        const records = await airtable.request();
        dispatchTodoActions({
          type: todoActions.loadTodos,
          records: records,
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        dispatchTodoActions({
          type: todoActions.setLoadError,
          error: err,
        });
      }
    };
    fetchTodos();
  }, [airtable]);

  const addTodo = async (title) => {
    const payload = {
      records: [
        {
          fields: {
            title: title,
            isCompleted: false,
          },
        },
      ],
    };
    try {
      dispatchTodoActions({ type: todoActions.startRequest });
      const records = await airtable.request(
        'POST',
        {
          'Content-Type': 'application/json',
        },
        { body: JSON.stringify(payload) }
      );
      dispatchTodoActions({
        type: todoActions.addTodo,
        records: records,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      dispatchTodoActions({
        type: todoActions.setLoadError,
        error: err,
      });
    } finally {
      dispatchTodoActions({ type: todoActions.endRequest });
    }
  };

  const completeTodo = async (id) => {
    dispatchTodoActions({
      type: todoActions.completeTodo,
      id: id,
    });

    const completedTodo = todoState.todoList.find((item) => item.id === id);
    const payload = {
      records: [
        {
          id: completedTodo.id,
          fields: {
            title: completedTodo.title,
            isCompleted: true,
          },
        },
      ],
    };
    try {
      await airtable.request(
        'PATCH',
        {
          'Content-Type': 'application/json',
        },
        { body: JSON.stringify(payload) }
      );
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      dispatchTodoActions({
        type: todoActions.revertTodo,
        error: `${err.message}. Reverting todo...`,
        editedTodo: editedTodo,
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    dispatchTodoActions({
      type: todoActions.updateTodo,
      editedTodo: editedTodo,
    });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    try {
      await airtable.request(
        'PATCH',
        {
          'Content-Type': 'application/json',
        },
        { body: JSON.stringify(payload) }
      );
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      dispatchTodoActions({
        type: todoActions.revertTodo,
        error: `${err.message}. Reverting todo...`,
        editedTodo: editedTodo,
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.titleRow}>
          <img className={styles.logoImg} src={logo} alt="Todo logo" />
          Todo List App
        </span>
      </h1>
      <TodosPage
        addTodo={addTodo}
        todoState={todoState}
        completeTodo={completeTodo}
        updateTodo={updateTodo}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {todoState.errorMessage.length > 0 ? (
        <section className={`${styles.panel} ${styles.error}`}>
          <p className={styles.errorText}>{todoState.errorMessage}</p>
          <button
            className={`btn ${styles.ghostButton}`}
            onClick={() =>
              dispatchTodoActions({ type: todoActions.clearError })
            }
          >
            Dismiss
          </button>
        </section>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default App;
