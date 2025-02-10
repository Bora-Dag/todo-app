export function getTodosFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

export function saveTodosToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}
