import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function Todos() {
    const [AlltodoItems, setAllTodoItems] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
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
                        value: {
                            title: newTodo.title,
                            description: newTodo.description,
                            completed: newTodo.done,
                            created: new Date().toISOString(),
                        },
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

    const handleUpdateTodo = async (id) => {
        if (selectedTodo) {
            try {
                console.log('Updating todo:', selectedTodo);

                const response = await axios.put(
                    `https://dev.hisptz.com/dhis2/api/dataStore/${process.env.REACT_APP_NAME}/${id}`,
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

    const generateTableRows = () => {
        const sortedItems = AlltodoItems.sort((a, b) => {
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
                    <td>{item.value.title}</td>
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
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Title</th>
                                                <th>Due Date</th>
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
                    {!selectedTodo?.value.completed && (
                        <Button variant="success" onClick={handleMarkAsDone}>
                            Mark as Done
                        </Button>
                    )}
                    <Button variant="primary" onClick={() => handleUpdateTodo(selectedTodo?.value.id)}>
                        Update
                    </Button>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Todos;
