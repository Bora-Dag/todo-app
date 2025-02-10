const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const todoRoutes = require('./routes/todos');
app.use('/api/todos', todoRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
