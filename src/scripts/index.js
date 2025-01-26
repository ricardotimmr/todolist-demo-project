const modal = document.getElementById('task-modal');
const openButton = document.getElementById('new-task-button');
const closeButton = document.getElementById('close-modal-button');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionTextarea = document.getElementById('task-description');
const backlogColumn = document.getElementById('window-backlog');
const editModal = document.getElementById('edit-task-modal');
const closeEditButton = document.getElementById('close-edit-modal-button');
const editTaskForm = document.getElementById('edit-task-form');
const editTaskTitleInput = document.getElementById('edit-task-title');
const editTaskDescriptionTextarea = document.getElementById('edit-task-description');

let currentTask = null;

// Open edit modal
document.addEventListener('click', (e) => {
  if (e.target?.classList.contains('edit')) {
    currentTask = e.target.closest('.task-card');

    if (currentTask) {
      const taskTitle = currentTask.querySelector('.task-card-header h3').textContent;
      const taskDescription = currentTask.querySelector('.task-card-body p').textContent;

      editTaskTitleInput.value = taskTitle;
      editTaskDescriptionTextarea.value = taskDescription;

      editModal.classList.add('active');
    }
  }
});

// Close edit modal
closeEditButton.addEventListener('click', () => {
  editModal.classList.remove('active');
});

editModal.addEventListener('click', (e) => {
  if (e.target === editModal) {
    editModal.classList.remove('active');
  }
});

// Save changes to the task
editTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const updatedTitle = editTaskTitleInput.value.trim();
  const updatedDescription = editTaskDescriptionTextarea.value.trim();

  if (!updatedTitle || !updatedDescription) {
    showToast('Both title and description are required!', 'error');
    return;
  }

  if (currentTask) {
    currentTask.querySelector('.task-card-header h3').textContent = updatedTitle;
    currentTask.querySelector('.task-card-body p').textContent = updatedDescription;

    showToast('Task updated successfully!', 'success');
    saveTasksToLocalStorage();
    editModal.classList.remove('active');
  }
});

// Open task modal
openButton.addEventListener('click', () => {
  taskTitleInput.value = '';
  taskDescriptionTextarea.value = '';
  modal.classList.add('active');
});

// Close task modal
closeButton.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

// Add a toast notification
function showToast(message, type = 'error') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);

  requestAnimationFrame(() => toast.classList.add('show'));
}

// Add a new task to the backlog
const taskForm = document.getElementById('task-form');
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskTitle = taskTitleInput.value.trim();
  const taskDescription = taskDescriptionTextarea.value.trim();

  if (!taskTitle || !taskDescription) {
    showToast('Both title and description are required!', 'error');
    return;
  }

  createTaskElement(taskTitle, taskDescription, 'window-backlog');
  saveTasksToLocalStorage();
  showToast('Task added successfully!', 'success');
  modal.classList.remove('active');
});

// Function to create a task element
function createTaskElement(title, description, columnId, id = `task-${Date.now()}`) {
  const newTaskCard = document.createElement('div');
  newTaskCard.classList.add('task-card');
  newTaskCard.setAttribute('draggable', 'true');
  newTaskCard.id = id;

  newTaskCard.innerHTML = `
    <div class="task-card-header">
      <h3>${title}</h3>
      <div class="task-card-actions">
        <span class="icon edit">edit</span>
        <span class="icon delete">delete</span>
      </div>
    </div>
    <div class="task-card-body">
      <p>${description}</p>
      <span class="icon circle">circle</span>
    </div>
  `;

  const column = document.getElementById(columnId);
  column.appendChild(newTaskCard);

  initializeTaskEvents(newTaskCard);
  updateTaskCounts();
}

// Initialize task events for edit and delete
function initializeTaskEvents(taskCard) {
  taskCard.querySelector('.edit').addEventListener('click', () => {
    currentTask = taskCard;
    editTaskTitleInput.value = taskCard.querySelector('.task-card-header h3').textContent;
    editTaskDescriptionTextarea.value = taskCard.querySelector('.task-card-body p').textContent;
    editModal.classList.add('active');
  });

  taskCard.querySelector('.delete').addEventListener('click', () => {
    taskCard.remove();
    updateTaskCounts();
    saveTasksToLocalStorage();
    showToast('Task deleted successfully!', 'success');
  });
}

// Drag-and-drop functionality
document.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('task-card')) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
  }
});

document.addEventListener('dragend', (e) => {
  if (e.target.classList.contains('task-card')) {
    e.target.classList.remove('dragging');
  }
});

// Allow columns to accept dragged tasks
const columns = document.querySelectorAll('.task-window');
columns.forEach((column) => {
  column.addEventListener('dragover', (e) => {
    e.preventDefault();
    column.classList.add('drag-over');
  });

  column.addEventListener('dragleave', () => {
    column.classList.remove('drag-over');
  });

  column.addEventListener('drop', (e) => {
    e.preventDefault();
    column.classList.remove('drag-over');

    const taskId = e.dataTransfer.getData('text/plain');
    const taskElement = document.getElementById(taskId);

    if (taskElement) {
      column.appendChild(taskElement);
      updateTaskCounts();
      saveTasksToLocalStorage();
    }
  });
});

// Update task counts for all columns
function updateTaskCounts() {
  document.querySelectorAll('.task-window').forEach((column) => {
    const taskCount = column.querySelectorAll('.task-card').length;
    const countElement = column.querySelector('.task-count');
    countElement.textContent = taskCount;
  });
}

// Save tasks to local storage
function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll('.task-card').forEach((taskCard) => {
    const taskTitle = taskCard.querySelector('.task-card-header h3').textContent;
    const taskDescription = taskCard.querySelector('.task-card-body p').textContent;
    const parentColumn = taskCard.closest('.task-window').id;

    tasks.push({
      id: taskCard.id,
      title: taskTitle,
      description: taskDescription,
      column: parentColumn,
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach((task) => {
    createTaskElement(task.title, task.description, task.column, task.id);
  });
}

// Initialize static tasks and load saved tasks
document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromLocalStorage();
});