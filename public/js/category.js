import { displayTodos } from './ui.js';
import { getTodosFromLocalStorage } from './todoStorage.js';

export function updateCategoryCounts(todos) {
    const inProgressCount = todos.filter(todo => !todo.completed && !checkIfOverdue(todo.dueDate, todo.dueTime)).length;
    const completedCount = todos.filter(todo => todo.completed).length;
    const overdueCount = todos.filter(todo => !todo.completed && checkIfOverdue(todo.dueDate, todo.dueTime)).length;
    const upcomingCount = todos.filter(todo => isWithinDays(todo.dueDate, todo.dueTime, 3)).length;
    const weekCount = todos.filter(todo => isWithinDays(todo.dueDate, todo.dueTime, 7)).length;
    const monthCount = todos.filter(todo => isWithinDays(todo.dueDate, todo.dueTime, 30)).length;

    document.getElementById('inProgressCount').innerText = inProgressCount;
    document.getElementById('completedCount').innerText = completedCount;
    document.getElementById('overdueCount').innerText = overdueCount;
    document.getElementById('upcomingCount').innerText = upcomingCount;
    document.getElementById('weekCount').innerText = weekCount;
    document.getElementById('monthCount').innerText = monthCount;
}

export function filterTodos(filter) {
    const todos = getTodosFromLocalStorage();
    displayTodos(todos, filter);
}

function checkIfOverdue(dueDate, dueTime) {
    const now = new Date();
    const dueDateTime = new Date(`${dueDate}T${dueTime}`);
    return now > dueDateTime;
}

function isWithinDays(dueDate, dueTime, days) {
    const now = new Date();
    const dueDateTime = new Date(`${dueDate}T${dueTime}`);
    const timeDiff = dueDateTime - now;
    return timeDiff >= 0 && timeDiff <= days * 24 * 60 * 60 * 1000;
}
