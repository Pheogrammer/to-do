import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

export async function fetchData() {
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
}
export async function handleAddTodo() {
    if (newTodo.title && newTodo.dueDate) {
        console.log('Step 1');
        try {
            console.log('Step 2');
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
}
export async function handleMarkAsDone() {
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
}
export async function handleUpdateTodo() {
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
}
export async function handleDeleteTodo() {
    const confirmed = window.confirm(
        'Are you sure you want to delete this todo item?'
    );

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
}
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const currentDate = new Date();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
const [allTodoItems, setallTodoItems] = useState([]); 
const [newTodo, setNewTodo] = useState({
    title: '',
    dueDate: '',
    done: false,
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);



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

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);