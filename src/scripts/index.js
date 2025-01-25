const modal = document.getElementById('task-modal');
const openButton = document.getElementById('new-task-button');
const closeButton = document.getElementById('close-modal-button');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionTextarea = document.getElementById('task-description');

// open task modal
openButton.addEventListener('click', () => {
  taskTitleInput.value = '';
  taskDescriptionTextarea.value = '';

  modal.classList.add('active');
});

// close task modal
closeButton.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

