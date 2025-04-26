
import { useRef, useState } from 'react'
import './App.css'

function App() {
  const [todo, setTodo] = useState([
    {id: Date.now(), content: '안녕하세요'}
  ]);

  return (
    <>
      <InputTodo setTodo = {setTodo} />
      <TodoList todo = {todo} setTodo = {setTodo} />
    </>
  )
}

const TodoList = ({todo, setTodo}) => {
  return (
    <ul>
      {todo.map((todo) => 
        <Todo key={todo.id} todo = {todo} setTodo = {setTodo} />
      )}
    </ul>
  );
}

const Todo = ({todo, setTodo}) => {
  return (
    <li>
      {todo.content}
      <button onClick={() => {
        setTodo(prev => prev.filter(el =>
          el.id !== todo.id
        ))
      }}>삭제</button>
    </li>
  );
}

const InputTodo = ({setTodo}) => {
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
    </>
  );
}

export default App
