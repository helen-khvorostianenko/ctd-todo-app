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

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };
      try { 
        const resp = await fetch(url, options);
        if(!resp.ok) {
          throw new Error(resp.message);
        }

        const { records } = await resp.json();
        const fetchedRows = records.map((record) => {
          const row = {
            id: record.id,
            ...record.fields,
          };
          if (!row.isCompleted) {
            row.isCompleted = false;
          }
          return row;
        });
        setTodoList([...fetchedRows]);
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
    const options = {
      method: 'POST',
      headers: { 
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };
    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();
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
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      setTodoList(originalTodos);
      const message = error instanceof Error ? error.message : String(error);
      console.log(message);
      setErrorMessage(message);
    }
  }

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
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
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
     try {
       const resp = await fetch(url, options);
       if (!resp.ok) {
         throw new Error(resp.message);
       }
     } catch (error) {
       const message = error instanceof Error ? error.message : String(error);
       console.log(message);
       setErrorMessage(message);
       const revertedTodos = originalTodo;
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
