import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function Home() {
  const [allTodoItems, setallTodoItems] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const currentDate = new Date();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  const [newTodo, setNewTodo] = useState({
    title: '',
    dueDate: '',
    done: false,
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/${process.env.REACT_APP_NAME}?fields=.`,
        {
          auth: {
            username: process.env.REACT_APP_USERNAME,
            password: process.env.REACT_APP_PASSWORD,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data.entries;
        console.log(data);
        setallTodoItems(data);
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
    setNewTodo({
      title: '',
      description: '',
      done: false,
    });
    setShowAddModal(false);
  };

  const handleAddTodo = async () => {
    if (newTodo.title && newTodo.dueDate) {
      console.log('Step 1');
      try {
        console.log('step 2');
        const todoId = uuidv4();

        console.log('Sending todo data:', newTodo);

        const response = await axios.post(
          `${process.env.REACT_APP_URL}/${process.env.REACT_APP_NAME}/${todoId}`,
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
            value: {
              title: newTodo.title,
              description: newTodo.description,
              completed: newTodo.done,
              created: new Date().toISOString(),
            },
          };
          setallTodoItems([...allTodoItems, newTodoItem]);
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

  const handleMarkAsDone = async (id) => {
    if (selectedTodo) {
      try {
        console.log('Marking as done:', selectedTodo);

        const response = await axios.put(
          `${process.env.REACT_APP_URL}/${process.env.REACT_APP_NAME}/${id}`,
          {
            ...selectedTodo.value,
            completed: true,
          },
          {
            auth: {
              username: process.env.REACT_APP_USERNAME,
              password: process.env.REACT_APP_PASSWORD,
            },
          }
        );

        if (response.status === 200) {
          console.log('Todo marked as done successfully!');
          fetchData();
          handleModalClose();
        } else {
          console.error(
            'Failed to mark todo as done:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Failed to mark todo as done:', error);
      }
    }
  };

  const handleUpdateTodo = async (id) => {
    if (selectedTodo) {
      try {
        console.log('Updating todo:', selectedTodo);

        const response = await axios.put(
          `${process.env.REACT_APP_URL}/${process.env.REACT_APP_NAME}/${id}`,
          selectedTodo.value,
          {
            auth: {
              username: process.env.REACT_APP_USERNAME,
              password: process.env.REACT_APP_PASSWORD,
            },
          }
        );

        if (response.status === 200) {
          console.log('Todo updated successfully!');
          fetchData();
          handleModalClose();
        } else {
          console.error(
            'Failed to update todo:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Failed to update todo:', error);
      }
    }
  };
  const handleDeleteTodo = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this todo item?');

    if (confirmed) {
      try {
        console.log('Deleting todo item:', id);

        const response = await axios.delete(
          `${process.env.REACT_APP_URL}/${process.env.REACT_APP_NAME}/${id}`,
          {
            auth: {
              username: process.env.REACT_APP_USERNAME,
              password: process.env.REACT_APP_PASSWORD,
            },
          }
        );

        if (response.status === 200) {
          console.log('Todo item deleted successfully!');
          fetchData();
          handleModalClose();
        } else {
          console.error(
            'Failed to delete todo item:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Failed to delete todo item:', error);
      }
    }
  };

  const generateTableRows = () => {
    const sortedItems = allTodoItems.sort((a, b) => {
      const dateA = new Date(a.value.created);
      const dateB = new Date(b.value.created);
      return dateA - dateB;
    });

    return sortedItems.map((item, index) => {
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
        <tr key={item.id}>
          <td>{index + 1}</td>
          <td >{item.value.title}</td>
          <td>{formattedDate}</td>
          <td>{item.value.completed ? 'Finished' : 'Pending'}</td>
          <td>{daysPassed}</td>
          <td>
            <Button onClick={() => handleModalOpen(item)}>Details</Button>
          </td>
        </tr>
      );
    });
  };


  return (
    <div>
      <div className="container">
        <div className="row mt-3">
          <div className="col">
            <div className="card">
              <div className="card-body text-center">
                <div>
                  <h4>Today is {currentDate.toDateString()}</h4>
                </div>
                <div>
                  <h5>Time is {currentTime}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-1">
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
                {allTodoItems.length > 0 ? (
                  <div className="card-head row">
                    <div className="col"></div>
                    <div className="col-md-4">
                      <Button
                        variant="success"
                        onClick={handleAddModalOpen}
                      >
                        Add New Todo Task
                      </Button>
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
                <div className="card-body">
                  <table className="table text-left">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Created On</th>
                        <th>Status</th>
                        <th>Days Passed</th>
                        <th>Manage</th>
                      </tr>
                    </thead>

                    <tbody>{generateTableRows()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle" className="mt-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter title"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                required
                rows={3}
                placeholder="Enter description"
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTodo}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={selectedTodo !== null} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Todo Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formId" className="mt-3">

              <Form.Control
                type="text"
                name="id"
                required
                value={selectedTodo?.value.id}
                hidden
                onChange={(e) =>
                  setSelectedTodo({
                    ...selectedTodo,
                    value: { ...selectedTodo.value, id: e.target.value },
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTitle" className="mt-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                required
                value={selectedTodo?.value.title}
                onChange={(e) =>
                  setSelectedTodo({
                    ...selectedTodo,
                    value: { ...selectedTodo.value, title: e.target.value },
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedTodo?.value.description}
                onChange={(e) =>
                  setSelectedTodo({
                    ...selectedTodo,
                    value: {
                      ...selectedTodo.value,
                      description: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>

          <Button variant="primary" onClick={() => handleUpdateTodo(selectedTodo?.value.id)}>
            Update
          </Button>
          {!selectedTodo?.value.completed && (
            <Button variant="success" onClick={() => handleMarkAsDone(selectedTodo?.value.id)}>
              Mark as Done
            </Button>
          )}
          <Button variant="danger" onClick={() => handleDeleteTodo(selectedTodo?.value.id)}>
            Delete
          </Button>

          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <div className="row mt-5">
          <div className="col">
            <div className="card">
              <div className="card-body text-center">
                Completed Todos
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col">
            <div className="card">
              <div className="card-body text-center">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Created At</th>
                      <th>Closed At</th>
                      <th>Days Passed</th>
                      <th>Manage</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
