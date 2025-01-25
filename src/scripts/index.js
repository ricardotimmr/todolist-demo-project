const modal = document.getElementById('task-modal');
const openButton = document.getElementById('new-task-button');
const closeButton = document.getElementById('close-modal-button');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionTextarea = document.getElementById('task-description');
const backlogColumn = document.getElementById('window-backlog');
const backlogTaskCount = document.querySelector('#header-backlog .task-count');

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

// Check character limit and show toast
taskTitleInput.addEventListener('input', () => {
  if (taskTitleInput.value.length >= 30) {
    taskTitleInput.value = taskTitleInput.value.substring(0, 30); // Ensure no more than 30 characters
    showToast("You've reached the maximum of 30 characters for the title.", 'error');
  }
});

// Check character limit and show toast
taskDescriptionTextarea.addEventListener('input', () => {
    if (taskDescriptionTextarea.value.length >= 100) {
      taskDescriptionTextarea.value = taskDescriptionTextarea.value.substring(0, 100); // Ensure no more than 30 characters
      showToast("You've reached the maximum of 100 characters for the description.", 'error');
    }
});

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
  newTaskCard.innerHTML = `
    <div class="task-card-header">
        <h3>${taskTitle}</h3>
        <div class="task-card-actions">
            <span class="icon edit">edit</span>
            <span class="icon delete">delete</span>
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
  const currentCount = parseInt(backlogTaskCount.textContent, 10);
  backlogTaskCount.textContent = currentCount + 1;

  // Show success toast
  showToast('Task added successfully!', 'success');

  // Close the modal
  modal.classList.remove('active');
});