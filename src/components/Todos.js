import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function Todos() {
    const currentDate = new Date();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    const [todoItems, setTodoItems] = useState([]);

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
                console.log(data);
                setTodoItems(data);
            } else {
                console.log('Failed: ' + response.data);
                console.error('Failed to fetch todo items:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch todo items:', error);
        }
    };


    const handleMarkAsDone = () => {
        if (selectedTodo) {
            const updatedTodos = todoItems.map((todo) => {
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
                        dueDate: newTodo.dueDate,
                        done: newTodo.done,
                    };
                    setTodoItems([...todoItems, newTodoItem]);
                    handleAddModalClose();
                    fetchData();
                } else {
                    console.log('Failed: ' + response);
                    console.error('Failed to add todo:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Failed to add todo:', error);
            }
        }
    };

    const AlltodoItems = todoItems;

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
                                {AlltodoItems.length > 0 ? (
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
                                                    {todoItems.map((item) => (
                                                        <tr key={item.key}>
                                                            <td>{item.value.title}</td>
                                                            <td>{item.value.created}</td>
                                                            <td>{item.value.completed ? 'Done' : 'Pending'}</td>
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
                                rows={3}
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
                        <Form.Group controlId="formDone">
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
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" readOnly value={selectedTodo?.title} />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} readOnly value={selectedTodo?.description} />
                        </Form.Group>
                        <Form.Group controlId="formDueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" readOnly value={selectedTodo?.dueDate} />
                        </Form.Group>
                        <Form.Group controlId="formDone">
                            <Form.Check type="checkbox" label="Done" checked={selectedTodo?.done} readOnly />
                        </Form.Group>
                    </Form>
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

export default Todos;
