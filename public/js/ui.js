import { saveTodosToLocalStorage, getTodosFromLocalStorage } from './todoStorage.js';
import { updateCategoryCounts } from './category.js';

let editingId = null;

export function displayTodos(todos, filter = 'all') {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.sort((a, b) => new Date(`${a.dueDate}T${a.dueTime || "23:59"}`) - new Date(`${b.dueDate}T${b.dueTime || "23:59"}`));

    const filteredTodos = todos.filter(todo => {
        if (filter === 'inProgress') return !todo.completed && !checkIfOverdue(todo.dueDate, todo.dueTime);
        if (filter === 'completed') return todo.completed;
        if (filter === 'overdue') return !todo.completed && checkIfOverdue(todo.dueDate, todo.dueTime);
        if (filter === '1-3days') return isWithinDays(todo.dueDate, todo.dueTime, 3);
        if (filter === 'thisWeek') return isWithinDays(todo.dueDate, todo.dueTime, 7);
        if (filter === 'thisMonth') return isWithinMonth(todo.dueDate);
        return true;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="alert alert-warning text-center" role="alert">
                No tasks available in this category!
            </div>
        `;
        return;
    }

    filteredTodos.forEach(todo => {
        let borderClass = 'border-secondary';
        if (todo.completed) borderClass = 'border-success';
        else if (checkIfOverdue(todo.dueDate, todo.dueTime)) borderClass = 'border-danger';

        const li = document.createElement('li');
        li.className = `list-group-item ${borderClass} p-3`;

        li.innerHTML = `
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-start">
                <div class="mb-2">
                    <strong>${todo.task}</strong> <br />
                    <span class="badge bg-${getPriorityBadgeColor(todo.priority)}">${todo.priority}</span> <br />
                    <small class="text-muted">(Due Date: ${formatDueDate(todo.dueDate, todo.dueTime)})</small> <br />
                    <small class="${todo.completed ? 'text-success' : 'text-danger'}">Remaining Time: ${calculateRemainingTime(todo.dueDate, todo.dueTime)}</small>
                </div>
                <div class="d-flex flex-wrap gap-2">
                    <button class="btn btn-outline-success btn-sm" onclick="toggleComplete(${todo.id})">${todo.completed ? 'Completed ✅' : 'Complete'}</button>
                    <button class="btn btn-info btn-sm" onclick="showDetails(${todo.id})">View Details</button>
                    <button class="btn btn-warning btn-sm" onclick="openEditModal(${todo.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTodo(${todo.id})">Delete</button>
                </div>
            </div>
        `;

        todoList.appendChild(li);
    });

    updateCategoryCounts(todos);
    updatePriorityCounts(todos); 
}

export function toggleComplete(id) {
    const todos = getTodosFromLocalStorage();
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodosToLocalStorage(todos);
        displayTodos(todos);
    }
}

export function showDetails(id) {
    const todos = getTodosFromLocalStorage();
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        document.getElementById('detailsTask').innerText = todo.task;
        document.getElementById('detailsDescription').innerText = todo.description || 'No description available';
        document.getElementById('detailsDueDate').innerText = formatDueDate(todo.dueDate, todo.dueTime);

        const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
        detailsModal.show();
    }
}

export function openEditModal(id) {
    const todos = getTodosFromLocalStorage();
    const todo = todos.find(todo => todo.id === id);

    if (todo) {
        document.getElementById('editTaskInput').value = todo.task;
        document.getElementById('editDescriptionInput').value = todo.description;
        document.getElementById('editDueDateInput').value = todo.dueDate;
        document.getElementById('editDueTimeInput').value = todo.dueTime || "23:59";
        document.getElementById('editPriorityInput').value = todo.priority;  

        editingId = id;

        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    }
}

export function saveEdit() {
    const todos = getTodosFromLocalStorage();
    const todo = todos.find(todo => todo.id === editingId);

    if (todo) {
        const task = document.getElementById('editTaskInput').value.trim();
        const description = document.getElementById('editDescriptionInput').value.trim();
        const dueDate = document.getElementById('editDueDateInput').value;
        const dueTime = document.getElementById('editDueTimeInput').value;
        const priority = document.getElementById('editPriorityInput').value;

        if (task === '' || dueDate === '') {
            alert('Task name and due date are required!');
            return;
        }

        todo.task = task;
        todo.description = description;
        todo.dueDate = dueDate;
        todo.dueTime = dueTime;
        todo.priority = priority;

        todos.sort((a, b) => {
            const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        saveTodosToLocalStorage(todos);
        displayTodos(todos);

        showEditSuccessMessage('Task has been successfully updated!');

        setTimeout(() => {
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            editModal.hide();
        }, 1500);
    }
}

function showEditSuccessMessage(message) {
    const successMessageDiv = document.getElementById('editSuccessMessage');

    successMessageDiv.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    setTimeout(() => {
        successMessageDiv.innerHTML = '';
    }, 1500);
}

export function deleteTodo(id) {
    let todos = getTodosFromLocalStorage();
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToLocalStorage(todos);
    displayTodos(todos);
}

function checkIfOverdue(dueDate, dueTime) {
    const now = new Date();
    const dueDateTime = new Date(`${dueDate}T${dueTime}`);
    return now > dueDateTime;
}

function formatDueDate(dueDate, dueTime) {
    const [year, month, day] = dueDate.split('-');
    return `${day}/${month}/${year} ${dueTime}`;
}

function calculateRemainingTime(dueDate, dueTime) {
    const now = new Date();
    const dueDateTime = new Date(`${dueDate}T${dueTime}`);
    const timeDiff = dueDateTime - now;
    if (timeDiff <= 0) return "Time is up";

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (days >= 1) return `${days} day(s)`;

    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} hour(s) ${minutes} minute(s)`;
}

function isWithinDays(dueDate, dueTime, days) {
    const now = new Date();
    const dueDateTime = new Date(`${dueDate}T${dueTime}`);
    const timeDiff = (dueDateTime - now) / (1000 * 60 * 60 * 24); 
    return timeDiff >= 0 && timeDiff <= days;
}

function isWithinMonth(dueDate) {
    const now = new Date();
    const dueDateTime = new Date(dueDate);
    return now.getFullYear() === dueDateTime.getFullYear() && now.getMonth() === dueDateTime.getMonth();
}

function getPriorityBadgeColor(priority) {
    switch (priority) {
        case 'High':
            return 'danger';  
        case 'Medium':
            return 'warning'; 
        case 'Low':
            return 'info';    
    }
}

function updatePriorityCounts(todos) {
    const highCount = todos.filter(todo => todo.priority === 'High').length;
    const mediumCount = todos.filter(todo => todo.priority === 'Medium').length;
    const lowCount = todos.filter(todo => todo.priority === 'Low').length;

    document.getElementById('highPriorityCount').innerText = highCount;
    document.getElementById('mediumPriorityCount').innerText = mediumCount;
    document.getElementById('lowPriorityCount').innerText = lowCount;
}
