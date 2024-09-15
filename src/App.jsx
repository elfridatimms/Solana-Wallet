import { useState } from 'react'


function App() {
  const [ erna, setErna ]= useState('tukica');

  return (
    <>
    <div className='flex items-center justify-center flex-col max-h-min bg-slate-300'>
    <h1 className='text-cyan-400'>PURNA JE: {erna}</h1>
    <button className='p-4 bg-slate-100 text-slate-900'
     onClick={() => setErna((prev)=>prev==='tukica' ? 'ET'  :'tukica' )}>ŠTA???</button>
      </div>
    </>
  )
}

export default App
