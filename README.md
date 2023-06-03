# Todo App

This is a simple Todo application built with React and Axios. It allows users to create, update, mark as done, and delete todo items. The application interacts with a backend API to perform these actions.

## Features

- Create a new todo item with a title, description.
- Update an existing todo item.
- Mark a todo item as done, or undone.
- Delete a todo item.
- Fetch and display all todo items from the backend API.

## Prerequisites

- Node.js >=15 and npm should be installed on your machine.

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/Pheogrammer/to-do.git
   ```

2. Install the dependencies:

   ```
   cd todo-app
   npm install
   ```

3. Configure the environment variables:

   - Rename the `.env.example` file to `.env`.
   - Replace the placeholders in the `.env` file with your API credentials.

4. Start the development server:

   ```
   npm start
   ```

5. Open your browser and visit [http://localhost:3000](http://localhost:3000) to view the Todo app.

## API Configuration

The Todo app interacts with a backend API for fetching, creating, updating, and deleting todo items. Make sure to configure the following environment variables in the `.env` file:

- `REACT_APP_URL`: The URL of the API.
- `REACT_APP_NAME`: The name of the API endpoint.
- `REACT_APP_USERNAME`: Your API username.
- `REACT_APP_PASSWORD`: Your API password.

## License

This project is licensed under the [MIT License](LICENSE).


