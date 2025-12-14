import './App.css';
import { useState } from 'react'; 
import TodoList from './Todolist';
import TodoForm from './TodoForm';

function App() {
  const [newTodo, setNewTodo] = useState('bugs fix');
  return (
    <div>
      <h1>My Tools</h1>
      <TodoForm />
      <p>newTodo
      </p>
      <TodoList />
    </div>
  );
}

export default App;
