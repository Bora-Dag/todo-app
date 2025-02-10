const express = require('express');
const router = express.Router();

let todos = [];

router.get('/', (req, res) => {
    res.json(todos);
});

router.post('/', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task name is required.' });
    }
    const newTodo = { id: Date.now().toString(), task };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(todo => todo.id !== id);
    res.status(200).json({ message: 'Task deleted.' });
});

module.exports = router;
