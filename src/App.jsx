import './App.css';
import { useState, useEffect, useMemo } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { airtableUrl, airtableToken } from './api/airtableConfig';
import { createAirtableClient } from './api/airtableClient';

const encodeUrl = ({ sortField, sortDirection, queryString }) => {
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = '';
  if (queryString?.trim()) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
  }
  return encodeURI(`${airtableUrl}?${sortQuery}${searchQuery}`);
};

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const airtable = useMemo(() => {
    return createAirtableClient({
      url: encodeUrl({ sortField, sortDirection, queryString }),
      token: airtableToken,
    });
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const records = await airtable.request();
        const fetchedRows = records.map((record) => {
          const row = {
            id: record.id,
            ...record.fields,
          };
          row.isCompleted = row.isCompleted ?? false;
          return row;
        });
        setTodoList(fetchedRows);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
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
      setIsSaving(true);
      const records = await airtable.request(
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
      setTodoList((prevTodoList) => [...prevTodoList, savedTodo]);
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
      await airtable.request(
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
    await airtable.request(
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
      <hr />
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
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
