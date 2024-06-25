import { useEffect, useState } from 'react';
import styles from './App.module.css';
import { transpile } from './alg';


const successDelay = 1500;
const initialInput = `interface Commit {
    id: string // уникальный идентификатор коммита
    noComment: number,
    noComment2: number;
    timestamp: number, // время создания в миллисекундах
parents?: string[]; // массив id родительских коммитов
         message?: string; // сообщение коммита
	branches?: string[]; // массив имён веток
    
    noCommentOpt?: number,
}`;


function App() {
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(()=>{
    setOutput(transpile(input));
    setIsActive(false);
  }, [input, setOutput]);

  function onCopy() {
    navigator.clipboard.writeText(output);
    setIsActive(true);
    setTimeout(()=>setIsActive(false), successDelay);
  }

  return (
    <div className={styles.container}>
      <h1> <u>Very-very simple</u> TS-to-JSDoc transpiler </h1>
      <h2> (Made for properly or close to properly spaced interfaces and types in frontend tasks in coderun.yandex.ru) </h2>
      <textarea placeholder='input' onChange={e=>setInput(e.target.value)} value={input} />
      <textarea placeholder='output' disabled value={output}/> 
      <div></div>
      <button onClick={onCopy} className={styles.copy + (isActive ? " "+styles.active : "")}>
        {isActive ? "Copied!" : <>
            Copy
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </>
        }
      </button>
    </div>
  )
}

export default App
