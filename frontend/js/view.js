import AddTodo from './components/add-todo.js';
import Modal from './components/modal.js';
import Filters from './components/filters.js';
import { groupTodosByCategory } from './helpers/group-todos.js';

export default class View {
  constructor() {
    this.model = null;
    this.table = document.getElementById('table');
    this.addTodoForm = new AddTodo();
    this.modal = new Modal();
    this.filters = new Filters();

    this.addTodoForm.onClick((title, description, category) => this.addTodo(title, description, category));
    this.modal.onClick((id, values) => this.editTodo(id, values));
    this.filters.onClick((filters) => this.filter(filters));
  }

  setModel(model) {
    this.model = model;
  }

  render() {
    const groups = groupTodosByCategory(this.model.getTodos());

    this.table.innerHTML = `
      <thead>
        <tr>
          <th scope="col">Todo</th>
          <th scope="col">Description</th>
          <th scope="col">Category</th>
          <th scope="col">
            <div class="d-flex justify-content-center">Completed</div>
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
    `;

    const categories = Object.keys(groups);

    if (categories.length === 0) {
      const emptyTbody = document.createElement('tbody');
      const emptyRow = emptyTbody.insertRow();
      const emptyCell = emptyRow.insertCell();
      emptyCell.colSpan = 5;
      emptyCell.classList.add('text-center');
      emptyCell.textContent = 'No tasks yet';
      this.table.appendChild(emptyTbody);
      return;
    }

    categories.forEach((category) => {
      const tasks = groups[category];
      const tbody = document.createElement('tbody');

      const headerRow = tbody.insertRow();
      const headerCell = headerRow.insertCell();
      headerCell.colSpan = 5;
      headerCell.classList.add('font-weight-bold', 'text-info');
      headerCell.appendChild(document.createTextNode(category));
      headerCell.appendChild(document.createTextNode(` (${tasks.length})`));

      tasks.forEach((todo) => this.createRow(todo, tbody));
      this.table.appendChild(tbody);
    });
  }

  filter(filters) {
    const { type, words } = filters;
    const rows = this.table.querySelectorAll('tr[data-type="task"]');

    rows.forEach((row) => {
      const [title, description, category, completed] = row.children;
      let shouldHide = false;

      if (words) {
        const query = words.toLowerCase();
        shouldHide = !title.innerText.toLowerCase().includes(query)
          && !description.innerText.toLowerCase().includes(query)
          && !category.innerText.toLowerCase().includes(query);
      }

      const shouldBeCompleted = type === 'completed';
      const isCompleted = completed.children[0].checked;

      if (type !== 'all' && shouldBeCompleted !== isCompleted) {
        shouldHide = true;
      }

      row.classList.toggle('d-none', shouldHide);
    });

    this.table.querySelectorAll('tbody').forEach((tbody) => {
      const visibleTasks = tbody.querySelectorAll('tr[data-type="task"]:not(.d-none)');
      tbody.classList.toggle('d-none', visibleTasks.length === 0);
    });
  }

  addTodo(title, description, category) {
    this.model.addTodo(title, description, category);
    this.render();
  }

  toggleCompleted(id) {
    this.model.toggleCompleted(id);
    this.render();
  }

  editTodo(id, values) {
    this.model.editTodo(id, values);
    this.render();
  }

  removeTodo(id) {
    this.model.removeTodo(id);
    this.render();
  }

  createRow(todo, tbody) {
    const row = tbody.insertRow();
    row.setAttribute('id', todo.id);
    row.dataset.type = 'task';

    const titleCell = row.insertCell();
    titleCell.textContent = todo.title;
    titleCell.dataset.label = 'Todo';

    const descriptionCell = row.insertCell();
    descriptionCell.textContent = todo.description;
    descriptionCell.dataset.label = 'Description';

    const categoryCell = row.insertCell();
    categoryCell.textContent = todo.category;
    categoryCell.dataset.label = 'Category';

    const completedCell = row.insertCell();
    completedCell.classList.add('text-center');
    completedCell.dataset.label = 'Completed';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.onclick = () => this.toggleCompleted(todo.id);
    completedCell.appendChild(checkbox);

    const actionsCell = row.insertCell();
    actionsCell.classList.add('text-right');
    actionsCell.dataset.label = 'Actions';

    const editBtn = document.createElement('button');
    editBtn.classList.add('btn', 'btn-primary', 'mb-1');
    editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
    editBtn.setAttribute('data-toggle', 'modal');
    editBtn.setAttribute('data-target', '#modal');
    editBtn.onclick = () => this.modal.setValues({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      category: todo.category,
      completed: todo.completed,
    });
    actionsCell.appendChild(editBtn);

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btn', 'btn-danger', 'mb-1', 'ml-1');
    removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
    removeBtn.onclick = () => this.removeTodo(todo.id);
    actionsCell.appendChild(removeBtn);
  }
}