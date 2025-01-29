# Network Backend

## Features
- Create a group if a user shares any project-related idea.
- Users can send requests.
- Real-time chat using Socket.io.

## Steps to Set Up

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/Network-backend.git
    cd Network-backend
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the necessary environment variables.

4. **Run the server:**
    ```sh
    npm start
    ```

5. **Using Socket.io for chat:**
    - Ensure Socket.io is installed:
        ```sh
        npm install socket.io
        ```
    - Initialize Socket.io in your server file:
        ```javascript
        const io = require('socket.io')(server);

        io.on('connection', (socket) => {
            console.log('a user connected');
            
            socket.on('chat message', (msg) => {
                io.emit('chat message', msg);
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
        ```

6. **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

## Contributing
Feel free to submit issues and pull requests.

## License
This project is licensed under the MIT License.