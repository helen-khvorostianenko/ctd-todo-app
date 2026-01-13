import './App.css';
import { useState, useEffect } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  function addTodo(title) {
    const newTodo = {
      id: Date.now(),
      title: title,
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((item) => {
      if (item.id === id) {
        return { ...item, isCompleted: true };
      }
      return item;
    });
    setTodoList(updatedTodos);
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map(
      (item) => {
        console.log(item);
        
        if (item.id === editedTodo.id) {
          return {...editedTodo};
        } else {
          return item;
        }
      }
    );
    setTodoList(updatedTodos);
  }

  const filteredTodoList = todoList.filter(
    (item) => item.isCompleted === false
  );

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={filteredTodoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
