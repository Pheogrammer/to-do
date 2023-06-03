import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
function Home() {
    const currentDate = new Date();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    const [todoItems, setTodoItems] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);

    useEffect(() => {
        const fetchTodoItems = async () => {
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
                    console.log("Success: "+response.data);
                    const mappedItems = Object.values(response.data).map((item) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        completed: item.completed,
                        created: item.created,
                        lastUpdated: item.lastUpdated,
                    }));
                    setTodoItems(mappedItems);
                } else {
                    console.log("failed: "+response);
                    console.error('Failed to fetch todo items:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch todo items:', error);
            }
        };

        fetchTodoItems();
    }, []);

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

    const todoItemsDueToday = todoItems.filter((item) => item.dueDate === currentDate.toISOString().split('T')[0]);

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
                                {todoItemsDueToday.length > 0 ? (
                                    <div>
                                        <h4>Here are what you have to accomplish today!</h4>
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
                                ) : (
                                    <p>No todo items due today.</p>
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
