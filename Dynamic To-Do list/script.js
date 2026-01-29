const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const STORAGE_KEY = 'todoList';
let todos = [];
let currentFilter = 'all';

// Initialize app
function init() {
    loadTodos();
    renderTodos();
    attachEnterKeyListener();
}

// Load todos from localStorage
function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    todos = stored ? JSON.parse(stored) : [];
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Add a new todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.unshift(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// Filter todos based on status
function filterTodos(filter) {
    currentFilter = filter;
    
    // Update filter button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTodos();
}

// Get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// Render todos
function renderTodos() {
    todoList.innerHTML = '';
    const filtered = getFilteredTodos();

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        todoList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        todoList.style.display = 'block';

        filtered.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    ${todo.completed ? 'checked' : ''} 
                    onchange="toggleTodo(${todo.id})"
                    aria-label="Mark task as complete"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            `;
            
            todoList.appendChild(li);
        });
    }

    updateStats();
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('completedCount').textContent = completed;
}

// Clear all completed todos
function clearAllCompleted() {
    if (todos.some(t => t.completed)) {
        if (confirm('Are you sure you want to delete all completed tasks?')) {
            todos = todos.filter(t => !t.completed);
            saveTodos();
            renderTodos();
        }
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow adding todo with Enter key
function attachEnterKeyListener() {
    todoInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTodo();
        }
    });
}

// Start the app
init();
