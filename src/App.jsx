
import { useRef, useState } from 'react'
import './App.css'

function App() {
  const [todo, setTodo] = useState([
    {id: Date.now(), content: '안녕하세요'}
  ]);
  const inputRef = useRef(null);

  const addTodoHandler = () => {
    const newTodo = {
      id: Date.now(), content: inputRef.current.value
    };
    setTodo(prev => [...prev, newTodo]);
  }

  return (
    <>
      <input type="text" ref={inputRef}/>
      <button onClick={addTodoHandler}>추가</button>
      <ul>
        {todo.map((el) => 
          <li key={el.id}>{el.content}</li>
        )}
      </ul>
    </>
  )
}

export default App
