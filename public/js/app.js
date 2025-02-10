import { getTodosFromLocalStorage, saveTodosToLocalStorage } from './todoStorage.js';
import { updateCategoryCounts, filterTodos } from './category.js';
import { displayTodos, toggleComplete, showDetails, openEditModal, deleteTodo, saveEdit } from './ui.js';

document.addEventListener('DOMContentLoaded', function () {
    const todos = getTodosFromLocalStorage();
    updateCategoryCounts(todos);
    displayTodos(todos);
});

let taskAttemptCount = 0;
let dueDateAttemptCount = 0;
let successAttemptCount = 0;

window.addTodo = function () {
    const taskInput = document.getElementById('taskInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const dueTimeInput = document.getElementById('dueTimeInput');
    const priorityInput = document.getElementById('priorityInput');

    const task = taskInput.value.trim();
    const description = descriptionInput.value.trim();
    const dueDate = dueDateInput.value;
    const dueTime = dueTimeInput.value || "23:59";
    const priority = priorityInput.value;

    document.getElementById('taskError').innerHTML = '';
    document.getElementById('dueDateError').innerHTML = '';

    let hasError = false;

    if (task === '') {
        taskAttemptCount++;
        document.getElementById('taskError').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Task name is required! - Attempt ${taskAttemptCount}
            </div>
        `;
        hasError = true;
    }

    if (dueDate === '') {
        dueDateAttemptCount++;
        document.getElementById('dueDateError').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Due date is required! - Attempt ${dueDateAttemptCount}
            </div>
        `;
        hasError = true;
    }

    if (hasError) return;

    const todos = getTodosFromLocalStorage();
    const newTodo = {
        id: Date.now(),
        task,
        description,
        dueDate,
        dueTime,
        priority,
        completed: false
    };

    todos.push(newTodo);

    todos.sort((a, b) => {
        const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    saveTodosToLocalStorage(todos);
    displayTodos(todos);

    successAttemptCount++;
    showAddSuccessMessage(`Task successfully added! - Success ${successAttemptCount}`);

    taskInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
    dueTimeInput.value = '';

    taskAttemptCount = 0;
    dueDateAttemptCount = 0;
};

function showAddSuccessMessage(message) {
    const successMessageDiv = document.getElementById('addSuccessMessage');

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

document.addEventListener('DOMContentLoaded', function () {
    const todos = getTodosFromLocalStorage();
    updateCategoryCounts(todos);
    updatePriorityCounts(todos); 
    displayTodos(todos);
});

function updatePriorityCounts(todos) {
    const highCount = todos.filter(todo => todo.priority === 'High').length;
    const mediumCount = todos.filter(todo => todo.priority === 'Medium').length;
    const lowCount = todos.filter(todo => todo.priority === 'Low').length;

    document.getElementById('highPriorityCount').innerText = highCount;
    document.getElementById('mediumPriorityCount').innerText = mediumCount;
    document.getElementById('lowPriorityCount').innerText = lowCount;
}

window.filterByPriority = function (priority) {
    const todos = getTodosFromLocalStorage();
    const filteredTodos = todos.filter(todo => todo.priority === priority);
    displayTodos(filteredTodos);
}

function handleButtonClick(event) {
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => button.classList.remove('active'));

    event.currentTarget.classList.add('active');
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});



window.filterTodos = filterTodos;
window.toggleComplete = toggleComplete;
window.showDetails = showDetails;
window.openEditModal = openEditModal;
window.deleteTodo = deleteTodo;
window.saveEdit = saveEdit;
