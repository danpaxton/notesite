import { useState } from 'react';
import Navbar from './navbar/Navbar';
import useToken from './utils/useToken.js';
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';

import Notes from './notes/Notes'
import Login from './login/Login';
import axios from 'axios';

export const api = axios.create({ baseURL: "https://notesite-three.vercel.app" });

function App() {
  const { token, setToken, removeToken } = useToken();
  const [loggedIn, setLoggedIn] = useState(false);
  const [notes, setNotes] = useState([]);

  const authError = () => {
    setLoggedIn(false);
    setNotes([]);
    removeToken();
  }
  
  return (
        <Router>
          <Navbar 
            authError={authError} setNotes={setNotes}
            loggedIn={loggedIn} setLoggedIn={setLoggedIn}
            token={token}
          />
          <Routes>
            <Route exact path='/' element={
              <Notes
                notes={notes} setNotes={setNotes}
                authError={authError} token={token}
              />}/>
            <Route path='/login' element={
              <Login 
                setLoggedIn={setLoggedIn} setNotes={setNotes}
                setToken={setToken}
              />}/>
          </Routes>
        </Router>
  )
}
export default App;
