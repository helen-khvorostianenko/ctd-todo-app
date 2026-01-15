import './App.css';
import { useState, useEffect } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const getErrorByStatus = (status) => {
    if (status === 401) return 'Authorization failed. Please check your API token.';
    if (status === 403) return "Access denied. You don't have permission.";
    if (status === 404) return 'Resource not found.';
    if (status === 429) return 'Too many requests. Please wait and try again.';
    if (status >= 500) return 'Server error. Please try again later.';
    return 'Request failed. Please try again.';
  };
  const fetchData = async function (method = 'GET', extraHeaders = {}, extraOptions = {}) {
    const headers = {
      Authorization: token,
      ...extraHeaders,
    };
    const options = {
      method: method,
      headers: headers,
      ...extraOptions,
    };

    let response;
    try {
      response = await fetch(url, options);
    } catch (e) {
      throw new Error(
        'Network error. Check your internet connection and try again.'
      );
    }
    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      throw new Error(getErrorByStatus(response.status));
    }
    const data = await response.json();
    const records = Array.isArray(data?.records) ? data.records : [];
    return records;
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try { 
        const records = await fetchData();
        const fetchedRows = records.map((record) => {
          const row = {
            id: record.id,
            ...record.fields,
          };
          row.isCompleted = row.isCompleted ?? false;
          return row;
        });
        setTodoList(fetchedRows);
      } catch(error) {
        const message = error instanceof Error ? error.message : String(error);
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

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
      setIsSaving(true);
      const records = await fetchData(
        'POST',
        {
          'Content-Type': 'application/json',
        },
        { body: JSON.stringify(payload) }
      );

      if (!records[0]) {
        throw new Error('No records returned from Airtable API');
      }
      const savedTodo = {
        id: records[0].id,
        ... records[0].fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(message);
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  const completeTodo = async(id) => {
    const originalTodos = todoList;
    const updatedTodos = todoList.map((item) => {
      if (item.id === id) {
        return { ...item, isCompleted: true };
      }
      return item;
    });
    setTodoList(updatedTodos);
   
    const completedTodo = updatedTodos.find((item) => item.id === id);
    if (!completedTodo) return;
    
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
      await fetchData(
        'PATCH',
        {
          'Content-Type': 'application/json',
        },
        { body: JSON.stringify(payload) }
      );
    } catch (error) {
      setTodoList(originalTodos);
      const message = error instanceof Error ? error.message : String(error);
      console.log(message);
      setErrorMessage(message);
    }
  }

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;
    const updatedTodos = todoList.map((item) => {
      if (item.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return item;
      }
    });
    setTodoList(updatedTodos);

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
    await fetchData(
      'PATCH',
      {
        'Content-Type': 'application/json',
      },
      { body: JSON.stringify(payload) }
    );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(message);
      setErrorMessage(`${message}. Reverting todo...`);
      const revertedTodos = updatedTodos.map((item) =>
        item.id === editedTodo.id ? originalTodo : item
      );
      setTodoList([...revertedTodos]);
    }
  }

  const filteredTodoList = todoList.filter(
    (item) => item.isCompleted === false
  );

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={filteredTodoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMessage.length > 0 ? (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default App;
