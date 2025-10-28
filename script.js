let tasks = [];
let editIndex = null;

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearAllBtn = document.getElementById('clearAllBtn');

function loadTasks() {
  const raw = localStorage.getItem('todo_tasks');
  tasks = raw ? JSON.parse(raw) : [];
}

function saveTasks() {
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


function render() {
  taskList.innerHTML = '';
  tasks.forEach((t, idx) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    li.innerHTML = `
      <div>
        <input type="checkbox" class="form-check-input me-2" data-index="${idx}" ${t.done ? 'checked' : ''}>
        <span class="task-text ${t.done ? 'completed' : ''}">${escapeHtml(t.text)}</span>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-warning btn-sm edit-btn" data-index="${idx}">Edit</button>
        <button class="btn btn-outline-danger btn-sm delete-btn" data-index="${idx}">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'}`;

  if (tasks.length > 0 && tasks.every(t => t.done)) {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }
}


function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  if (editIndex !== null) {

    tasks[editIndex].text = text;
    editIndex = null;
    addTaskBtn.textContent = 'Add';
  } else {

    tasks.push({ text, done: false });
  }

  taskInput.value = '';
  saveTasks();
  render();
}


taskList.addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    const i = Number(e.target.dataset.index);
    tasks[i].done = e.target.checked;
    saveTasks();
    render();
  }
});


taskList.addEventListener('click', (e) => {
  const i = Number(e.target.dataset.index);

  if (e.target.matches('.delete-btn')) {
    tasks.splice(i, 1);
    saveTasks();
    render();
  }

  if (e.target.matches('.edit-btn')) {
    taskInput.value = tasks[i].text;
    editIndex = i;
    addTaskBtn.textContent = 'Update';
    taskInput.focus();
  }
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    saveTasks();
    render();
  }
});

loadTasks();
render();

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

