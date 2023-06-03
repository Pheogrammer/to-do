import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

function Home() {
  const [AlltodoItems, setAllTodoItems] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    dueDate: '',
    done: false,
    description: '',
  });
  const currentDate = new Date();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://dev.hisptz.com/dhis2/api/dataStore/${process.env.REACT_APP_NAME}?fields=.`,
        {
          auth: {
            username: process.env.REACT_APP_USERNAME,
            password: process.env.REACT_APP_PASSWORD,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data.entries;
        setAllTodoItems(data);
      } else {
        console.error(
          'Failed to fetch todo items:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Failed to fetch todo items:', error);
    }
  };

  const handleMarkAsDone = () => {
    if (selectedTodo) {
      const updatedTodos = AlltodoItems.map((todo) =>
        todo.id === selectedTodo.id ? { ...todo, done: true } : todo
      );
      setAllTodoItems(updatedTodos);
      setSelectedTodo(null);
    }
  };

  const handleModalOpen = (todo) => {
    setSelectedTodo(todo);
  };

  const handleModalClose = () => {
    setSelectedTodo(null);
  };

  const handleAddModalOpen = () => {
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setNewTodo({ title: '', dueDate: '', done: false, description: '' });
  };

  const handleAddTodo = async () => {
    if (newTodo.title && newTodo.dueDate) {
      try {
        const todoId = uuidv4();

        console.log('Sending todo data:', newTodo);

        const response = await axios.post(
          `https://dev.hisptz.com/dhis2/api/dataStore/${process.env.REACT_APP_NAME}/${todoId}`,
          {
            id: todoId,
            title: newTodo.title,
            description: newTodo.description,
            completed: newTodo.done,
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          },
          {
            auth: {
              username: process.env.REACT_APP_USERNAME,
              password: process.env.REACT_APP_PASSWORD,
            },
          }
        );

        if (response.status === 200) {
          console.log('Todo added successfully!');
          const newTodoItem = {
            id: todoId,
            title: newTodo.title,
            description: newTodo.description,
          };
          setAllTodoItems([...AlltodoItems, newTodoItem]);
          handleAddModalClose();
          fetchData();
        } else {
          console.error(
            'Failed to add todo:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Failed to add todo:', error);
      }
    }
  };

  const generateTableRows = () => {
    const sortedItems = AlltodoItems
      .filter((item) => !item.value.completed)
      .sort((a, b) => {
        const dateA = new Date(a.value.created);
        const dateB = new Date(b.value.created);
        return dateA - dateB;
      });

    return sortedItems.slice(0, 5).map((item, index) => {
      const createdDate = new Date(item.value.created);
      const currentDate = new Date();
      const timeDiff = Math.abs(currentDate - createdDate);
      const daysPassed = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      const formattedDate = createdDate.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return (
        <tr key={item.key}>
          <td>{index + 1}</td>
          <td>{item.value.title}</td>
          <td>{formattedDate}</td>
          <td>{item.value.completed ? 'Done' : 'Pending'}</td>
          <td>{daysPassed}</td>
        </tr>
      );
    });
  };

  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          <div className="col">
            <div className="card">
              <div className="card-body text-center mt-5">
                <h1>Welcome!</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <div className="card">
              <div className="card-body text-center">
                <div>
                  <h4>Today is {currentDate.toDateString()}</h4>
                </div>
                <div>
                  <h5>Now is {currentTime}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <div className="card">
              <div className="card-body text-center">
                {AlltodoItems.length > 0 ? (
                  <div>
                    <h4>Here are the top 5 todo items:</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Title</th>
                          <th>Due Date</th>
                          <th>Status</th>
                          <th>Days Passed</th>
                        </tr>
                      </thead>
                      <tbody>{generateTableRows()}</tbody>
                    </table>
                    <div>
                      <Link to="/todos">View More</Link>
                    </div>
                  </div>
                ) : (
                  <p>No todo items found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={selectedTodo !== null} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Todo Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTodo && (
            <div>
              <h5>Title: {selectedTodo.title}</h5>
              <p>Due Date: {selectedTodo.dueDate}</p>
              <p>Status: {selectedTodo.done ? 'Done' : 'Pending'}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!selectedTodo?.done && (
            <Button variant="success" onClick={handleMarkAsDone}>
              Mark as Done
            </Button>
          )}
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
