import { useState } from 'react';
import Navbar from './navbar/Navbar';
import { useCookies } from "react-cookie";
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';

import Notes from './notes/Notes'
import Login from './login/Login';
import axios from 'axios';

export const api = axios.create({ baseURL: "http://localhost:5000/", withCredentials: true });

function App() {
  // eslint-disable-next-line no-unused-vars
  const [cookies, removeCookie] = useCookies([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [notes, setNotes] = useState([]);

  const authError = () => {
    setLoggedIn(false);
    setNotes([]);
    removeCookie('token');
  }
  
  return (
        <Router>
          <Navbar 
            authError={authError} setNotes={setNotes}
            loggedIn={loggedIn} setLoggedIn={setLoggedIn}
          />
          <Routes>
            <Route exact path='/' element={
              <Notes
                notes={notes} setNotes={setNotes}
                authError={authError}
              />}/>
            <Route path='/login' element={
              <Login 
                setLoggedIn={setLoggedIn} setNotes={setNotes}
              />}/>
          </Routes>
        </Router>
  )
}
export default App;
