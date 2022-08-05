import { toDoProjects } from './logic';
import {
  createElementFromTemplate,
  createProjectSectionDropdownElementTemplate,
} from './elementsTemplates';
import { isMobile } from './mobile';

export const main = document.querySelector('main');

export function toggleEmptyState(projectIndex) {
  let onlyTasksContainer;

  if (projectIndex === 'today') {
    if (document.querySelector('[data-section="overdue"]:not(.show)')) {
      onlyTasksContainer = document.querySelector(
        `.main-content[data-project="${projectIndex}"] [data-section="0"] .tasks-items`,
      );
    } else {
      onlyTasksContainer = false;
    }
  } else {
    onlyTasksContainer = document.querySelector(
      `.main-content[data-project="${projectIndex}"] section:only-of-type .tasks-items`,
    );
  }

  const disabledCompletedTasks = document.querySelector(
    `.main-content[data-project="${projectIndex}"] .completed-tasks-items:not(.active)`,
  );
  const emptyCompletedTasks = document.querySelector(
    `.main-content[data-project="${projectIndex}"] .completed-tasks-items .task-item`,
  );
  const emptyState = document.querySelector(
    `.main-content[data-project="${projectIndex}"] .empty-state`,
  );

  if (onlyTasksContainer && (!emptyCompletedTasks || disabledCompletedTasks)) {
    if (onlyTasksContainer.firstElementChild === null) {
      emptyState.classList.add('active');
    } else {
      emptyState.classList.remove('active');
    }
  } else {
    emptyState.classList.remove('active');
  }
}

export function updateProjectTasksNumber(projectIndex) {
  if (typeof projectIndex === 'undefined') {
    const projectElement = document.querySelector('.main-content.enabled');
    projectIndex = projectElement.dataset.project;
  }

  if (isNaN(projectIndex) === false) {
    projectIndex = parseInt(projectIndex);
  }

  const tasksNumberElement = document.querySelector(
    `.sidebar-item[data-project="${projectIndex}"] .item-number`,
  );
  let tasksNumber = 0;

  if (projectIndex === 'today') {
    Object.keys(toDoProjects.today).forEach((key) => {
      tasksNumber += toDoProjects.today[key].length;
    });
  } else {
    toDoProjects.projects[projectIndex].sections.forEach((section) => {
      tasksNumber += section.tasks.length;
    });
  }

  if (tasksNumber === 0) {
    tasksNumber = '';
  }

  tasksNumberElement.textContent = tasksNumber;
}

export function saveTaskBoxTask() {
  const addTaskBoxTask = (() => {
    if (document.querySelector('.add-task-box-container:not(.main)')) {
      const addTaskBoxContainer = document.querySelector(
        '.add-task-box-container',
      );
      const addTask = document.querySelector('.add-todo');
      addTask.click();
      addTaskBoxContainer.remove();
      const addTaskButtons = document.querySelectorAll('.add-task');
      addTaskButtons.forEach((button) => {
        button.style.display = 'flex';
      });
    }
  })();

  const editTaskBoxTask = (() => {
    if (document.querySelector('.edit-task-box-container')) {
      const editTaskBoxContainer = document.querySelector(
        '.edit-task-box-container',
      );
      const editTask = document.querySelector('.edit-task');
      editTask.click();
      editTaskBoxContainer.remove();
    }
  })();
}

export function disableElementScroll(el) {
  const TopScroll = el.pageYOffset || el.scrollTop;
  const LeftScroll = el.pageXOffset || el.scrollLeft;

  el.onscroll = function () {
    el.scrollTo(LeftScroll, TopScroll);
  };
}

export function enableElementScroll(el) {
  el.onscroll = function () {};
}

export function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom
      <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function toggleShowTodaySections() {
  const overdueSection = document.querySelector('[data-section="overdue"]');
  const todayTasksSectionHeader = document.querySelector(
    '[data-project="today"] [data-section="0"] .section-top',
  );
  const todayItemsNumberDOM = document.querySelector(
    '.main-filters-item[data-project="today"] .item-number',
  );
  if (toDoProjects.today.overdueTasks.length > 0) {
    overdueSection.classList.add('show');
    todayTasksSectionHeader.classList.add('show');
    todayItemsNumberDOM.classList.add('overdue');
  } else {
    overdueSection.classList.remove('show');
    todayTasksSectionHeader.classList.remove('show');
    todayItemsNumberDOM.classList.remove('overdue');
  }
}

export function changeTextareaHeightOnInput() {
  if (this.style.height === '') {
    this.setAttribute('style', `height:${this.offsetHeight}px;`);
  }

  const { height } = this.style;
  if (
    this.nextElementSibling
    && this.nextElementSibling.matches('.textarea-content')
  ) {
    this.nextElementSibling.value = this.value;
    if (`${this.nextElementSibling.scrollHeight}px` === height) return;
  }

  const { maxHeight } = getComputedStyle(this);
  let newHeight;

  function setNewHeight(textarea) {
    if (
      textarea.nextElementSibling
      && textarea.nextElementSibling.matches('.textarea-content')
    ) {
      newHeight = `${textarea.nextElementSibling.scrollHeight}px`;
      textarea.style.height = newHeight;
    } else {
      textarea.style.height = 'auto';
      newHeight = `${textarea.scrollHeight}px`;
      textarea.style.height = newHeight;
    }
  }
  setNewHeight(this, false);

  if (parseInt(newHeight) >= parseInt(maxHeight)) newHeight = maxHeight;

  this.style.height = height;
  if (newHeight !== height) {
    setTimeout(() => {
      this.style.height = newHeight;
      this.scrollTop = 0;
    }, 4);
  }
}

export function updateTodayTasksElementsIndixes(todayID, newTask) {
  const todayTasks = document.querySelectorAll('.task-item[data-today-id]');

  if (newTask) {
    todayTasks.forEach((todayTask) => {
      if (todayTask.dataset.todayId >= todayID) {
        todayTask.dataset.todayId = +todayTask.dataset.todayId + 1;
      }
    });
  } else {
    todayTasks.forEach((todayTask) => {
      if (todayTask.dataset.todayId > todayID) {
        todayTask.dataset.todayId -= 1;
      }
    });
  }
}

export function updateOverdueTasksElementsIndixes(overdueID, newTask) {
  const overdueTasks = document.querySelectorAll('.task-item[data-overdue-id]');

  if (newTask) {
    overdueTasks.forEach((overdueTask) => {
      if (overdueTask.dataset.overdueId >= overdueID) {
        overdueTask.dataset.overdueId = +overdueTask.dataset.overdueId + 1;
      }
    });
  } else {
    overdueTasks.forEach((overdueTask) => {
      if (overdueTask.dataset.overdueId > overdueID) {
        overdueTask.dataset.overdueId -= 1;
      }
    });
  }
}

export function deleteTodayTaskElement(todayID) {
  const todayTaskElement = document.querySelector(
    `[data-project="today"] [data-today-id="${todayID}"]`,
  );

  todayTaskElement.style.maxHeight = `${todayTaskElement.offsetHeight}px`;
  todayTaskElement.classList.add('disappearing');
  setTimeout(() => {
    todayTaskElement.remove();
  }, 285);

  updateTodayTasksElementsIndixes(todayID, false);
  updateProjectTasksNumber('today');
}

export function deleteOverdueTaskElement(overdueID) {
  const overdueTaskElement = document.querySelector(
    `[data-project="today"] [data-overdue-id="${overdueID}"]`,
  );

  overdueTaskElement.style.maxHeight = `${overdueTaskElement.offsetHeight}px`;
  overdueTaskElement.classList.add('disappearing');
  setTimeout(() => {
    overdueTaskElement.remove();
  }, 285);

  updateOverdueTasksElementsIndixes(overdueID, false);
  updateProjectTasksNumber('today');
}

export function loadAllProjectsSectionsDropdownElements(
  selectProjectSectionDropdown,
) {
  toDoProjects.projects.forEach((project, projectIndex) => {
    const projectSectionsElements = [];
    project.sections.forEach((section, sectionIndex) => {
      const projectSectionDropdownElementTemplate = createProjectSectionDropdownElementTemplate(projectIndex, sectionIndex);
      const projectSectionDropdownElement = createElementFromTemplate(
        projectSectionDropdownElementTemplate,
      );
      projectSectionsElements.push(projectSectionDropdownElement);
    });
    projectSectionsElements.forEach((projectSectionDropdownElement) => {
      selectProjectSectionDropdown.appendChild(projectSectionDropdownElement);
    });
  });
}
