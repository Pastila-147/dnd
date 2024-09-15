export default class Task {

  constructor(container, headerText) {
    this.container = container;

    this.tasks = this.createElementWithClass("div", "container-task");
    container.appendChild(this.tasks);

    const header = this.createHeader(headerText);
    this.tasks.appendChild(header);

    this.taskList = this.createElementWithClass("div", "task_list");
    this.tasks.appendChild(this.taskList);

    this.adderCard = this.createAdderCard();
    this.tasks.appendChild(this.adderCard);

    this.adderCard.addEventListener("click", (e) => this.onAddCardClick(e));
    this.taskList.addEventListener("mousedown", (e) => this.onMouseDownTask(e));

    this.dragging = null;
    this.startX = 0;
    this.startY = 0;
  }

  createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    return element;
  }

  createHeader(headerText) {
    const header = this.createElementWithClass("div", "tasks_header");
    const tasksHeaderText = this.createElementWithClass("h5", "tasks_header_text");
    tasksHeaderText.textContent = headerText;
    header.appendChild(tasksHeaderText);
    return header;
  }

  createAdderCard() {
    const adderCard = this.createElementWithClass("div", "adder_card");
    adderCard.textContent = "+ Add card";
    return adderCard;
  }

  onMouseDownTask(e) {
    e.preventDefault();
    if (e.button !== 0) return;

    const actualEl = e.target;

    if (!actualEl.classList.contains("task_card")) {
      return;
    }

    this.dragging = actualEl;

    const rect = this.dragging.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;

    this.previousNeighbour = this.dragging.previousElementSibling;
    this.nextNeighbour = this.dragging.nextElementSibling;

    this.placeholder = document.createElement("div");
    this.placeholder.style.width = `${this.dragging.offsetWidth}px`;
    this.placeholder.style.height = `${this.dragging.offsetHeight}px`;
    this.dragging.parentNode.insertBefore(this.placeholder, this.dragging);

    this.dragging.classList.add("dragging");

    this.dragging.style.left = `${rect.left}px`;
    this.dragging.style.top = `${rect.top}px`;
    this.dragging.style.width = `${rect.width}px`;

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    document.documentElement.addEventListener("mouseup", this.onMouseUp);
    document.documentElement.addEventListener("mousemove", this.onMouseMove);
  };

  onMouseMove(e) {
    if (!this.dragging) return;

    const posX = e.clientX - this.startX;
    const posY = e.clientY - this.startY;
    this.dragging.style.left = `${posX}px`;
    this.dragging.style.top = `${posY}px`;

    const { target } = e;
    if (target.classList.contains("task_card")) {
      const rect = target.getBoundingClientRect();
      const dropY = e.clientY - rect.top;
      if (dropY > rect.height / 2) {
        target.parentNode.insertBefore(this.placeholder, target.nextSibling);
      } else {
        target.parentNode.insertBefore(this.placeholder, target);
      }
    }
  };

  onMouseUp(e) {
    if (!this.dragging) return;

    this.dragging.style = undefined;

    const { target } = e;
    let previous = target.previousElementSibling;
    if (previous && !previous.classList.contains("task_card")) {
      previous = null;
    }
    let next = target.nextElementSibling;
    if (next && !next.classList.contains("task_card")) {
      next = null;
    }

    const targetList = target.closest(".task_list");
    let container = targetList;

    if (!targetList) {
      previous = this.previousNeighbour;
      next = this.nextNeighbour;
      container = this.dragging.parentNode;
    } else if (targetList && !previous && !next) {
      targetList.appendChild(this.dragging);
    }

    if (previous) {
      container.insertBefore(this.dragging, previous.nextSibling);
    } else if (next) {
      container.insertBefore(this.dragging, next);
    } else {
      container.appendChild(this.dragging);
    }

    this.dragging.classList.remove("dragging");

    if (this.placeholder && this.placeholder.parentNode) {
      this.placeholder.parentNode.removeChild(this.placeholder);
    }

    this.dragging = null;
    this.placeholder = null;

    document.documentElement.removeEventListener("mouseup", this.onMouseUp);
    document.documentElement.removeEventListener("mouseover", this.onMouseMove);
  };

  onAddCardClick(e) {
    if (e.button !== 0) return;
    this.addCard();
  };

  addCard(textTask = undefined) {
    const card = document.createElement("div");
    card.classList.add("task_card");

    const tmp = document.createElement("div");
    tmp.classList.add("close_button_container");
    card.appendChild(tmp);

    const closeButton = document.createElement("span");
    closeButton.classList.add("close_button");
    closeButton.innerText = "×";

    closeButton.addEventListener("click", (e) => {
      e.preventDefault();
      card.remove();
    });

    tmp.appendChild(closeButton);

    const cardText = document.createElement("div");
    cardText.classList.add("content_card");
    cardText.setAttribute("contenteditable", "true"); 
    cardText.innerText = textTask || ""; 

    card.appendChild(cardText);

    setTimeout(() => {
      cardText.focus();
    }, 0);

    this.taskList.appendChild(card);
  };
}

