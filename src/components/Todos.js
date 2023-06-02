import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function Todos() {
  const currentDate = new Date();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const [todoItems, setTodoItems] = useState([
    { id: 1, title: 'Task 1', dueDate: '2023-06-02', done: false },
    { id: 2, title: 'Task 2', dueDate: '2023-06-02', done: false },
    { id: 3, title: 'Task 3', dueDate: '2023-06-02', done: false }
  ]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: '', dueDate: '', done: false, description: '' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleMarkAsDone = () => {
    if (selectedTodo) {
      const updatedTodos = todoItems.map(todo => {
        if (todo.id === selectedTodo.id) {
          return { ...todo, done: true };
        }
        return todo;
      });
      setTodoItems(updatedTodos);
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
        const lastId = todoItems.length > 0 ? Math.max(...todoItems.map(todo => todo.id)) : 0;
        const todoId = lastId + 1;

        console.log('Sending todo data:', newTodo);

        const response = await fetch(`https://dev.hisptz.com/dhis2/api/dataStore/${process.env.NAME}/${todoId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: todoId,
            title: newTodo.title,
            description: newTodo.description,
            completed: newTodo.done,
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          console.log('Todo added successfully!');
          const newTodoItem = {
            id: todoId,
            title: newTodo.title,
            description: newTodo.description,
            dueDate: newTodo.dueDate,
            done: newTodo.done,
          };
          setTodoItems([...todoItems, newTodoItem]);
          handleAddModalClose();
        } else {
          console.error('Failed to add todo:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to add todo:', error);
      }
    }
  };

  const todoItemsDueToday = todoItems.filter(item => item.dueDate === currentDate.toISOString().split('T')[0]);

  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          <div className="col">
            <div className="card mt-3">
              <div className="card-body text-center">
                <div>
                  <h5>Here is everything you have in your bucket list</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <div className="card">
              <div className="text-center mt-3">
                {todoItemsDueToday.length > 0 ? (
                  <div className="card-head row">
                    <div className="col">
                      <h4>Here are what you have to accomplish today!</h4>
                    </div>
                    <div className="col-md-4">
                      <Button variant="primary" onClick={handleAddModalOpen}>
                        Add Todo
                      </Button>
                    </div>

                    <div className="card-body">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Manage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todoItemsDueToday.map(item => (
                            <tr key={item.id}>
                              <td>{item.title}</td>
                              <td>{item.dueDate}</td>
                              <td>{item.done ? 'Done' : 'Pending'}</td>
                              <td>
                                <Button onClick={() => handleModalOpen(item)}>Manage</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>No todo items due today.</p>
                    <div className="col-md-4">
                      <Button variant="primary" onClick={handleAddModalOpen}>
                        Add Todo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Check
                type="checkbox"
                label="Done"
                checked={newTodo.done}
                onChange={(e) => setNewTodo({ ...newTodo, done: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTodo}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Todos;
