import './App.css';
import styles from './App.module.css';
import logo from './assets/todo-list-svgrepo-com.svg';
import { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { airtableUrl, airtableToken } from './api/airtableConfig';
import { createAirtableClient } from './api/airtableClient';
import { reducer as todoReduser, actions as todoActions, initialState as initialTodoState, actions } from './reducers/todos.reducer';

function App() {
  // Satte for managing todo list and UI state 
  // const [todoList, setTodoList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [isSaving, setIsSaving] = useState(false);
  
  const [todoState, dispatchTodoActions] = useReducer(todoReduser, initialTodoState);

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
      // setIsLoading(true);
      dispatchTodoActions({type: todoActions.fetchTodos});
      try {
        const records = await airtable.request();
        dispatchTodoActions({
          type: todoActions.loadTodos,
          records: records,
        });
        // const fetchedRows = records.map((record) => {
        //   const row = {
        //     id: record.id,
        //     ...record.fields,
        //   };
        //   row.isCompleted = row.isCompleted ?? false;
        //   return row;
        // });
        // setTodoList(fetchedRows);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        dispatchTodoActions({
          type: todoActions.setLoadError,
          error: err,
        });
        // const message = error instanceof Error ? error.message : String(error);
        // setErrorMessage(message);
      }
    };
    fetchTodos();
  }, [airtable]);

  const addTodo = async (title) => {
    const payload = {
      records: [
        {
          fields:{
            title: title,
            isCompleted: false,
          }
        },
      ],
    };
    try {
      // setIsSaving(true);
      dispatchTodoActions({type: todoActions.startRequest});
      const records = await airtable.request(
        'POST',
        {
          'Content-Type': 'application/json',
        },
        { body: JSON.stringify(payload) }
      );

      // if (!records[0]) {
      //   throw new Error('No records returned from Airtable API');
      // }
      // const savedTodo = {
      //   id: records[0].id,
      //   ... records[0].fields,
      // };
      // if (!records[0].fields.isCompleted) {
      //   savedTodo.isCompleted = false;
      // }
      // setTodoList((prevTodoList) => [...prevTodoList, savedTodo]);
      dispatchTodoActions({
        type: todoActions.addTodo,
        records: records,
      });
    } catch (error) {
      // const message = error instanceof Error ? error.message : String(error);
      // console.log(message);
      // setErrorMessage(message);
      const err = error instanceof Error ? error : new Error(String(error));
      dispatchTodoActions({
        type: todoActions.setLoadError,
        error: err,
      });
    } finally {
      // setIsSaving(false);
       dispatchTodoActions({ type: todoActions.endRequest });
    }
  }

  const completeTodo = async(id) => {
    // const originalTodos = todoList;
    // const updatedTodos = todoList.map((item) => {
    //   if (item.id === id) {
    //     return { ...item, isCompleted: true };
    //   }
    //   return item;
    // });
    // setTodoList(updatedTodos);
   
    // const completedTodo = updatedTodos.find((item) => item.id === id);
    // if (!completedTodo) return;
    
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
      // setTodoList(originalTodos);
      // const message = error instanceof Error ? error.message : String(error);
      // console.log(message);
      // setErrorMessage(message);
      const err = error instanceof Error ? error : new Error(String(error));
      dispatchTodoActions({
        type: todoActions.revertTodo,
        error: `${err.message}. Reverting todo...`,
        editedTodo: editedTodo,
      });
    }
  }

  const updateTodo = async (editedTodo) => {
    // const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    // if (!originalTodo) return;
    // const updatedTodos = todoList.map((item) => {
    //   if (item.id === editedTodo.id) {
    //     return { ...editedTodo };
    //   } else {
    //     return item;
    //   }
    // });
    // setTodoList(updatedTodos);

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
      console.log(error)
      // const message = error instanceof Error ? error.message : String(error);
      // console.log(message);
      // setErrorMessage(`${message}. Reverting todo...`);
      // const revertedTodos = updatedTodos.map((item) =>
      //   item.id === editedTodo.id ? originalTodo : item
      // );
      // setTodoList([...revertedTodos]);
      
      const err = error instanceof Error ? error : new Error(String(error));
      dispatchTodoActions({
        type: todoActions.revertTodo,
        error: `${err.message}. Reverting todo...`,
        editedTodo: editedTodo,
      });
    }
  }
  
  const filteredTodoList = todoState.todoList.filter(
    (item) => item.isCompleted === false
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.titleRow}>
          <img className={styles.logoImg} src={logo} alt="Todo logo" />
          Todo List App
        </span>
      </h1>
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
      {todoState.errorMessage.length > 0 ? (
        <section className={`${styles.panel} ${styles.error}`}>
          <p className={styles.errorText}>{todoState.errorMessage}</p>
          <button
            className={`btn ${styles.ghostButton}`}
            onClick={() => dispatchTodoActions({type: todoActions.clearError})}
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
