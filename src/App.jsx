import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [todo, setTodo] = useState([
    {id: Date.now(), content: '안녕하세요'}
  ]);

  return (
    <>
      <Advice />
      <Clock />
      <StopWatch />
      <Timer />
      <InputTodo setTodo = {setTodo} />
      <TodoList todo = {todo} setTodo = {setTodo} />
    </>
  );
}

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    fetch(url)
    .then(res => res.json())
    .then(data => {
      setData(data);
      setIsLoading(false);
    })
    .catch(error => {
      setError(error);
      setIsLoading(false);
    })
  }, [url]);
  return [data, isLoading, error];
}

const Advice = () => {
  
  const [data, isLoading, error] = useFetch('https://korean-advice-open-api.vercel.app/api/advice');

  return (
    <div>
      {isLoading && <p>로딩 중..</p>}
      {error && <p>에러 발생: {error.message}</p>}
      {!isLoading && !error && data && (
        <>
          <p>{data.message}</p>
          <p>-{data.author}-</p>
        </>
      )}
    </div>
  );
}

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return (
    <div>{time.toLocaleTimeString()}</div>
  );
}

const formatTime = (seconds) => {
  return `${String(Math.floor(seconds / 3600)).padStart(2, '0')} : ${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')} : ${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

const StopWatch = () => {
  const [time, setTime] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const timerRef = useRef(null);
  console.log(timerRef)

  useEffect(() => {
    if (isOn) {
      const timerId = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
      timerRef.current = timerId;
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current) // else문으로 켜고 끌 수는 있지만, 컴포넌트 언마운트될 경우를 위해서 필요(컴포넌트가 사라질 때는 else문이 실행되지 않음)
  }, [isOn]);

  return (
    <>
    <div>{formatTime(time)}</div>
    <button onClick={() => {
      setIsOn(prev => !prev)
    }}>{isOn ? '끄기' : '켜기'}</button>
    <button onClick={() => {
      setTime(0);
      setIsOn(false);
    }}>리셋</button>
    </>
  )
}

const Timer = () => {
  const [startTime, setStartTime] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn && time > 0) {
      const timerId = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
      timerRef.current = timerId;
    } else if (!isOn || time === 0) {
      setIsOn(false);
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current)
  }, [isOn, time]);

  return (
    <div>
      <div>{formatTime(time || startTime)}</div>
      <input 
      type="range" 
      value={startTime} 
      max = "3600"
      onChange={(e) => setStartTime(e.target.value)}
      disabled={isOn}/> {/* disabled true일 때 비활성화 = 타이머 돌아갈 때 비활성화 */}
      <button onClick={() => {
        setIsOn(true);
        setTime(time || startTime);
      }}>시작</button>
      <button onClick={() => {
        setIsOn(false);
      }}>중지</button>
      <button onClick={() => {
        setIsOn(false);
        setTime(0);
        setStartTime(0); {/* 리액트는 state를 비동기로 처리하기 때문에 즉시 적용하는게 아니라 렌더링 주기에 따라 적용됨 그래서 만약 time===0일 때 렌더링 시 startTime이 화면에 아주 잠깐 나올 수 있음 */}
      }}>리셋</button>
    </div>
  );
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
