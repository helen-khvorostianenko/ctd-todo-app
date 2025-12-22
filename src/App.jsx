import './App.css';
import { useState } from 'react'; 
import TodoList from './TodoList';
import TodoForm from './TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  function addTodo(title) {
    const newTodo = {
      id: Date.now(),
      title: title,
      isCompleted: false,
    }
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((item) => {
      if (item.id === id) {
        return ({...item, isCompleted: true});
      } 
      return item;
    });
    setTodoList(updatedTodos);
  }

  const filteredTodoList = todoList.filter((item) => item.isCompleted === false);
  
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={filteredTodoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
