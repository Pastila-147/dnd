import Task from "./Trello DnD";

const container = document.querySelector(".container");

const tasks = container.querySelectorAll(".task");
const task1 = tasks[0];

const containerTasks = document.createElement("div");
containerTasks.classList.add("container-tasks");
task1.appendChild(containerTasks);

const tasksTodo = new Task(containerTasks, "todo");
const tasksInProgress = new Task(containerTasks, "in progress");
const tasksDone = new Task(containerTasks, "done");