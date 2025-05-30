import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Posts } from './pages/Posts/Posts'
import { Profile } from './pages/Profile/Profile'
import { Signin } from './pages/Signin/Signin'
import { Signup } from './pages/Signup/Signup'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Posts />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Signin/>} />
        <Route path='/profile/:id' element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
