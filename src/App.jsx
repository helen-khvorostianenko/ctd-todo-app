import './App.css';
import { useState } from 'react'; 
import TodoList from './Todolist';
import TodoForm from './TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  function addTodo(title) {
    const newTodo = {
      id: Date.now(),
      title: title,
    }
    setTodoList([...todoList, newTodo]);
  }
  
  return (
    <div>
      <h1>My Tools</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
