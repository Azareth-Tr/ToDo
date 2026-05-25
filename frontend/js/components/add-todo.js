import Alert from './alert.js';

export default class AddTodo {
  constructor() {
    this.btn = document.getElementById('add');
    this.title = document.getElementById('title');
    this.description = document.getElementById('description');
    this.category = document.getElementById('category');

    this.alert = new Alert('alert');
  }

  onClick(callback) {
    this.btn.onclick = () => {
      if (this.title.value === '' || this.description.value === '') {
        this.alert.show('Title and description are required');
      } else {
        this.alert.hide();
        callback(this.title.value, this.description.value, this.category.value);
      }
    };
  }
}