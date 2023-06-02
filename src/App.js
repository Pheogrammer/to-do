import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Todos from './components/Todos';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = process.env.REACT_APP_USERNAME;
        const password = process.env.REACT_APP_PASSWORD;
        const name = process.env.REACT_APP_NAME;

        const response = await axios.get(
          `https://dev.hisptz.com/dhis2/api/dataStore/${name}?fields=.&page=1&page=2`,
          {
            auth: {
              username,
              password,
            },
          }
        );
        setTodos(response.data.entries);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todos" element={<Todos todos={todos} />} />
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;
