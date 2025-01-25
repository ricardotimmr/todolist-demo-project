const modal = document.getElementById('task-modal');
const openButton = document.getElementById('new-task-button');
const closeButton = document.getElementById('close-modal-button');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionTextarea = document.getElementById('task-description');
const backlogColumn = document.getElementById('window-backlog');
const backlogTaskCount = document.querySelector('#header-backlog .task-count');
const editModal = document.getElementById('edit-task-modal');
const closeEditButton = document.getElementById('close-edit-modal-button');
const editTaskForm = document.getElementById('edit-task-form');
const editTaskTitleInput = document.getElementById('edit-task-title');
const editTaskDescriptionTextarea = document.getElementById('edit-task-description');
let currentTask = null; // Store the task being edited

// Open edit modal
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('edit')) {
    // Find the parent task card
    currentTask = e.target.closest('.task-card');

    if (currentTask) {
      // Pre-fill the form with the task details
      const taskTitle = currentTask.querySelector('.task-card-header h3').textContent;
      const taskDescription = currentTask.querySelector('.task-card-body p').textContent;

      editTaskTitleInput.value = taskTitle;
      editTaskDescriptionTextarea.value = taskDescription;

      // Show the edit modal
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
  e.preventDefault(); // Prevent form submission

  // Get updated task details
  const updatedTitle = editTaskTitleInput.value.trim();
  const updatedDescription = editTaskDescriptionTextarea.value.trim();

  // Validate inputs
  if (updatedTitle === '' || updatedDescription === '') {
    showToast('Both title and description are required!', 'error');
    return;
  }

  if (currentTask) {
    // Update the task card with the new details
    currentTask.querySelector('.task-card-header h3').textContent = updatedTitle;
    currentTask.querySelector('.task-card-body p').textContent = updatedDescription;

    // Show success toast
    showToast('Task updated successfully!', 'success');

    // Close the edit modal
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

  // Create the toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Add the toast to the container
  toastContainer.appendChild(toast);

  // Automatically remove the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300); // Remove after fade-out
  }, 3000);

  // Show the toast
  requestAnimationFrame(() => toast.classList.add('show'));
}

// Add a new task to the backlog
const taskForm = document.getElementById('task-form');
taskForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form submission

  // Get task details
  const taskTitle = taskTitleInput.value.trim();
  const taskDescription = taskDescriptionTextarea.value.trim();

  // Validate inputs
  if (taskTitle === '' || taskDescription === '') {
    showToast('Both title and description are required!', 'error');
    return;
  }

  // Create a new task card
  const newTaskCard = document.createElement('div');
  newTaskCard.classList.add('task-card');
  newTaskCard.setAttribute('draggable', 'true'); // Make it draggable
  const uniqueId = `task-${Date.now()}`; // Create a unique ID based on timestamp
  newTaskCard.id = uniqueId;

  newTaskCard.innerHTML = `
    <div class="task-card-header">
        <h3>${taskTitle}</h3>
        <div class="task-card-actions">
            <span class="icon edit" id="task-edit">edit</span>
            <span class="icon delete" id="task-delete">delete</span>
        </div>
    </div>
    <div class="task-card-body">
        <p>${taskDescription}</p>
        <span class="icon circle">circle</span>
    </div>
  `;

  // Add the new task card to the backlog column
  backlogColumn.appendChild(newTaskCard);

  // Update the task count
  updateTaskCounts();

  // Show success toast
  showToast('Task added successfully!', 'success');

  // Close the modal
  modal.classList.remove('active');
});

// Add event listener for delete buttons
document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('delete')) {
      // Find the parent task card
      const taskCard = e.target.closest('.task-card');
  
      if (taskCard) {
        // Remove the task card from its parent column
        taskCard.remove();
  
        // Update task counts
        updateTaskCounts();
  
        // Show success toast
        showToast('Task deleted successfully!', 'success');
      }
    }
  });

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

      // Update task count for both columns
      updateTaskCounts();
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

// Assign draggable attribute and IDs to static tasks (if needed)
function initializeStaticTasks() {
  const tasks = document.querySelectorAll('.task-card');
  tasks.forEach((task, index) => {
    task.id = `static-task-${index}`;
    task.setAttribute('draggable', true);
  });
}

// Initialize static tasks on page load
initializeStaticTasks();