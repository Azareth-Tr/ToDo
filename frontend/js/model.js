import { normalizeCategory } from './helpers/group-todos.js';

export default class Model {
  constructor() {
    this.view = null;
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');

    if (!storedTodos.length) {
      this.todos = [
        {
          id: 0,
          title: 'Learn JS',
          description: 'Watch JS Tutorials',
          category: 'General',
          completed: false,
        }
      ];
    } else {
      this.todos = storedTodos.map((todo, index) => ({
        ...todo,
        id: typeof todo.id === 'number' ? todo.id : index,
        category: normalizeCategory(todo.category),
      }));
    }

    this.currentId = this.todos.length
      ? Math.max(...this.todos.map((todo) => todo.id)) + 1
      : 1;
  }

  setView(view) {
    this.view = view;
  }

  save() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  getTodos() {
    return this.todos.map((todo) => ({ ...todo }));
  }

  findTodo(id) {
    return this.todos.findIndex((todo) => todo.id === id);
  }

  toggleCompleted(id) {
    const index = this.findTodo(id);
    const todo = this.todos[index];
    todo.completed = !todo.completed;
    this.save();
  }

  editTodo(id, values) {
    const index = this.findTodo(id);
    Object.assign(this.todos[index], values);
    this.todos[index].category = normalizeCategory(this.todos[index].category);
    this.save();
  }

  addTodo(title, description, category = 'General') {
    const todo = {
      id: this.currentId++,
      title,
      description,
      category: normalizeCategory(category),
      completed: false,
    };

    this.todos.push(todo);
    this.save();

    return { ...todo };
  }

  removeTodo(id) {
    const index = this.findTodo(id);
    this.todos.splice(index, 1);
    this.save();
  }
}