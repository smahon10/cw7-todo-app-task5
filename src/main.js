import "../style.css";

function createTodosDataStructure() {
  let todos = [];
  let nextTodoId = 1;
  let filter = "all";

  function addTodo(text) {
    todos = [...todos, {
      id: nextTodoId++, 
      text: text,
      isCompleted: false,
    }];
  }

  function toggleCompleted(id) {
    todos = todos.map(todo => {
      if (todo.id !== id) {
        return todo;
      } else {
        return {
          id: todo.id,
          text: todo.text,
          isCompleted: !todo.isCompleted
        }
      }
    })
  }

  function setFilter(newFilter) {
    filter = newFilter;
  }

  function getTodos() {
    return todos.filter(todo => {
      if (filter === "all") {
        return true;
      } else if (filter === "completed" && todo.isCompleted) {
        return true;
      } else if (filter === "active" && !todo.isCompleted) {
        return true;
      }

      return false;
    })
  }

  return {
    getTodos,
    addTodo,
    toggleCompleted,
    getFilter: () => filter,
    setFilter
  }
}

const todosDataStructure = createTodosDataStructure();

function createTodoItemDiv(todo) {
  const todoItemDiv = document.createElement("div");
  todoItemDiv.classList.add("p-4", "todo-item");

  const todoTextDiv = createTodoTextDiv(todo);
  const todoEditInput = createTodoEditInput(todo);

  todoItemDiv.appendChild(todoTextDiv);
  todoItemDiv.appendChild(todoEditInput);

  return todoItemDiv;
}

function createTodoTextDiv(todo) {
  const todoTextDiv = document.createElement("div");
  todoTextDiv.classList.add("todo-text")
  todo.isCompleted && todoTextDiv.classList.add("line-through")
  todoTextDiv.textContent = todo.text;
  todoTextDiv.setAttribute("todo-id", todo.id)
  return todoTextDiv;
}

function createTodoEditInput(todo) {
  const todoEditInput = document.createElement("input");
  todoEditInput.classList.add("hidden", "todo-edit")
  todoEditInput.setAttribute("value", todo.text);
  return todoEditInput;
}

function renderTodos() {
  document
      .getElementById("todo-list")
      .replaceChildren(
        ...todosDataStructure
        .getTodos()
        .map(
          createTodoItemDiv
        )
      );
}

function getFilterFromAnchor(anchor) {
  const action = anchor.href.split("/").pop();
  const filter = action === "" ? "all" : action;
  return filter 
}

function renderNavbar() {
  const anchors = document.getElementById("todo-nav").children;
  Array.from(anchors).forEach(anchor => 
    anchor
      .classList[
        todosDataStructure.getFilter() === getFilterFromAnchor(anchor) ? "add" : "remove"
      ](
        "underline",
        "underline-offset-4", 
        "decoration-rose-800", 
        "decoration-2"
      )
  );
}

function init() {
  renderTodos();

  document
    .getElementById("todo-nav")
    .addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (target.tagName === "A") {
          todosDataStructure.setFilter(getFilterFromAnchor(target));
          renderTodos();
          renderNavbar();
        }
      }
    )

  document
    .getElementById("todo-list")
    .addEventListener(
      "click",
      (event) => {
        const target = event.target;
        const todoId = target.getAttribute("todo-id")
        todosDataStructure.toggleCompleted(Number(todoId));
        renderTodos();
      }
    )

  document
    .getElementById("new-todo")
    .addEventListener(
      "keydown",
      (event) => {
        const key = event.key;
        if (key === "Enter") {
          const todoText = event.target.value;
          todosDataStructure.addTodo(todoText);
          renderTodos();
          event.target.value = "";
        }
      }
    )
}

document.addEventListener(
  "DOMContentLoaded", 
  init
);