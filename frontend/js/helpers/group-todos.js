export function normalizeCategory(value) {
  const category = (value ?? 'General').toString().trim();

  return category || 'General';
}

export function groupTodosByCategory(todos = []) {
  return todos.reduce((groups, todo) => {
    const category = normalizeCategory(todo.category);

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(todo);

    return groups;
  }, {});
}
