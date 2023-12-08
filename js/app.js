// Initialize variables and DOM elements
let selectedCategory = categories[0];
const menuBtn = document.querySelector('.menu-btn'),
      backBtn = document.querySelector('.back-btn'),
      screenWrapper = document.querySelector('.container'),
      categoriesContainer = document.querySelector('.categories'),
      tasksContainer = document.querySelector('.tasks'),
      numTasks = document.getElementById('num-tasks'),
      categoryTitle = document.getElementById('category-title'),
      categoryImg = document.getElementById('category-img'),
      categorySelect = document.getElementById('category-select'),
      addTaskWrapper = document.querySelector('.add-task'),
      addTaskBtn = document.querySelector('.add-task-btn'),
      taskInput = document.querySelector('#task-input'),
      blackBackdrop = document.querySelector('.black-backdrop'),
      addBtn = document.querySelector('.add-btn'),
      cancelBtn = document.querySelector('.cancel-btn'),
      totalTasks = document.getElementById('total-tasks');

/* EVENTS */
menuBtn.addEventListener('click', toggleScreen);
backBtn.addEventListener('click', toggleScreen);
addBtn.addEventListener('click', (e) => {addTask(e)});
cancelBtn.addEventListener('click', toggleAddTaskForm);
addTaskBtn.addEventListener('click', toggleAddTaskForm);
blackBackdrop.addEventListener('click', toggleAddTaskForm);

/* Functions with using Local Storage */
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const localTasks = JSON.parse(localStorage.getItem('tasks'));
  if(localTasks) {
    tasks = localTasks;
  }
}

/* Function Screen */
function toggleScreen() {
  screenWrapper.classList.toggle('show-category');
}

/* Rendering */
function updateTotals() {
  const categoryTasks = tasks.filter((task) => task.category.toLowerCase() === selectedCategory.title.toLowerCase());
  numTasks.innerHTML = `${categoryTasks.length} Tasks`;
  totalTasks.innerHTML = tasks.length;
}

function renderCategories() {
  categoriesContainer.innerHTML = '';
  categories.forEach((category) => {
    const categoryTasks = tasks.filter((task) => task.category.toLowerCase() === category.title.toLowerCase());
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('category');
    taskDiv.addEventListener('click', () => {
      screenWrapper.classList.toggle('show-category');
      selectedCategory = category;
      updateTotals();
      categoryTitle.textContent = category.title;
      categoryImg.src = `assets/img/${category.img}`;
      renderTasks();
    });

    taskDiv.innerHTML = `
    <div class="left">
    <img src="assets/img/${category.img}"
     alt="${category.title}"
      />
    <div class="content">
      <h1>${category.title}</h1>
      <p>${categoryTasks.length} Tasks</p>
    </div>
  </div>
  <div class="options">
    <div class="toggle-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
        />
      </svg>
    </div>
  </div>
    `;

    categoriesContainer.append(taskDiv);
  });
}

function renderTasks() {
  tasksContainer.innerHTML = '';
  const categoryTasks = tasks.filter((task) => task.category.toLowerCase() === selectedCategory.title.toLowerCase());
  if(categoriesContainer.length === 0) {
    tasksContainer.innerHTML = `<p class="no-tasks">No tasks added for this category</p>`;
  } else {
    categoryTasks.forEach((task) => {
      const div = document.createElement("div");
      div.classList.add("task-wrapper");
      const label = document.createElement("label");
      label.classList.add("task");
      label.setAttribute("for", task.id);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = task.id;
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => {
        const index = tasks.findIndex((t) => t.id === task.id);
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
      });
      div.innerHTML = `
      <div class="delete">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </div>
              `;
      label.innerHTML = `
        <span class="checkmark"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </span>
        <p>${task.task}</p>
        `;
        label.prepend(checkbox);
        div.prepend(label);
        tasksContainer.appendChild(div);

        const deleteBtn = div.querySelector(".delete");
        deleteBtn.addEventListener("click", () => {
          const index = tasks.findIndex((t) => t.id === task.id);
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        });
    });
    renderCategories();
    updateTotals();
  }
}

/* Function toggle addTaskForm */
function toggleAddTaskForm() {
  addTaskWrapper.classList.toggle("active");
  blackBackdrop.classList.toggle("active");
  addTaskBtn.classList.toggle("active");
}

/* Function addTask */

function addTask(e) {
  e.preventDefault();
  const task = taskInput.value;
  const newCategory = categorySelect.value;
  if(task === '') {
    taskInput.style.border = '1px solid red';
    taskInput.placeholder = "Please enter a task";
  } else {
   const newTask = {
    id: tasks.length + 1,
    task,
    category: newCategory,
    completed: false
   };
   taskInput.value = '';
   tasks.push(newTask);
   saveTasks();
   renderTasks();
   toggleAddTaskForm();
   taskInput.style.border = '1px solid #ccc';
   taskInput.placeholder = "";
  }
}


loadTasks();
renderTasks();
categories.forEach((category) => {
  const option = document.createElement('option');
  option.value = category.title.toLowerCase();
  option.textContent = category.title;
  categorySelect.appendChild(option);
});
