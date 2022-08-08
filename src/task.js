import { format } from 'date-fns';
import flatpickr from 'flatpickr';
import { reject } from 'lodash';
import {
  toDoProjects,
  projectCreate,
  saveToDoProjects,
  addTodayTask,
  deleteTodayTask,
  deleteOverdueTask,
  updateOverdueTasksIndixes,
  getNewOverdueTaskID,
} from './logic';
import {
  createElementFromTemplate,
  createTaskTemplate,
  addTaskBoxTemplate,
  editTaskBoxTemplate,
} from './elementsTemplates';
import {
  main,
  changeTextareaHeightOnInput,
  loadAllProjectsSectionsDropdownElements,
  saveTaskBoxTask,
  isElementInViewport,
  enableElementScroll,
  disableElementScroll,
  updateProjectTasksNumber,
  toggleShowTodaySections,
  updateTodayTasksElementsIndixes,
  updateOverdueTasksElementsIndixes,
  deleteTodayTaskElement,
  deleteOverdueTaskElement,
  resetAnimation,
} from './utilities';
import { virtualKeyboard } from './virtualKeyboard';
import { closeModals } from './modals';
import { sideBar } from './project';
import { isMobile } from './mobile';

const { DateTime } = require('luxon');

function updateTaskBoxInputs(taskBox, projectIndex) {
  const initializeInputs = (() => {
    const addTaskTitleInput = taskBox.querySelector('.task-title');
    const taskDescriptionInput = taskBox.querySelector('.add-task-description');

    addTaskTitleInput.value = '';
    changeTextareaHeightOnInput.call(addTaskTitleInput);

    taskDescriptionInput.value = '';
    changeTextareaHeightOnInput.call(taskDescriptionInput);
  })();

  const selectedPriority = taskBox.querySelector('.selected-priority');
  selectedPriority.dataset.priority = 4;

  const initializeSelectPriorityButton = (() => {
    const priorityOptions = taskBox.querySelectorAll('.priority-item');
    priorityOptions.forEach((option) => {
      if (option === priorityOptions[3]) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
  })();

  const initializeDueDateSelector = (() => {
    const dueDateSelector = taskBox.querySelector('.duedate-selector');
    const selectedDueDate = taskBox.querySelector('.selected-duedate');
    const scheduleInput = taskBox.querySelector('.schedule-input');
    const date = projectIndex === 'today' ? DateTime.local() : undefined;

    const flatpickr = scheduleInput.flatpickr({
      minDate: 'today',
      defaultDate: typeof date === 'object' ? date.toJSDate() : null,
      disableMobile: 'true',
    });

    if (projectIndex === 'today') {
      updateDueDate(scheduleInput, dueDateSelector, selectedDueDate);
    } else {
      dueDateSelector.classList.remove('today');
      selectedDueDate.textContent = 'Schedule';
      flatpickr.clear();
    }
  })();

  const addTaskButton = taskBox.querySelector('.add-todo');
  addTaskButton.classList.remove('enabled');
  initializeSelectProjectSectionDropdown();
}

const resetTaskbox = new Event('resetTaskbox');

async function updateTaskBox() {
  const taskBox = this;
  let delayIsOver;

  const start = () => new Promise((resolve) => {
    (function checkIfDelayIsOver() {
      if (!delayIsOver) {
        setTimeout(() => {
          if (delayIsOver) {
            resolve();
          } else {
            checkIfDelayIsOver();
          }
        }, 150);
      }
    }());
  });

  if (taskBox.classList.contains('main')) {
    setTimeout(() => {
      delayIsOver = true;
    }, 750);
  } else {
    delayIsOver = true;
  }

  await start;

  const projectIndex = document.querySelector('.main-content.enabled')
    .dataset.project;
  const delay = isMobile ? 400 : 0;

  setTimeout(() => {
    updateTaskBoxInputs(taskBox, projectIndex);
  }, delay);
}

const options = {
  attributes: true,
};

const mainAddTaskBoxContainer = document.querySelector(
  '.add-task-box-container.main',
);

function updateDueDate(scheduleInput, dueDateSelector, selectedDueDate) {
  if (scheduleInput.value) {
    const timezoneID = DateTime.local().zoneName;
    const date = DateTime.fromFormat(
      `${scheduleInput.value} 23:59:59`,
      'yyyy-MM-dd hh:mm:ss',
      { zone: timezoneID },
    );

    const now = DateTime.local();

    if (date.startOf('day').ts === now.startOf('day').ts) {
      dueDateSelector.classList.remove('overdue');
      dueDateSelector.classList.add('today');
      selectedDueDate.textContent = 'Today';
    } else {
      if (date.year === now.year) {
        dueDateSelector.classList.remove('overdue');
        dueDateSelector.classList.remove('today');
        selectedDueDate.textContent = format(date.toJSDate(), 'LLL d');
      } else {
        dueDateSelector.classList.remove('overdue');
        dueDateSelector.classList.remove('today');
        selectedDueDate.textContent = format(date.toJSDate(), 'LLL d uuuu');
      }
      if (date < now) {
        dueDateSelector.classList.add('overdue');
      }
    }
  }
}

function initializeSelectProjectSectionDropdown(
  addTaskContainer,
  projectIndex,
  sectionIndex,
) {
  if (addTaskContainer) {
    if (projectIndex === 'today') {
      projectIndex = '0';
    }
    const projectSectionDropdownElement = addTaskContainer.querySelector(
      `.project-section-item[data-project="${projectIndex}"][data-section="${sectionIndex}"]`,
    );
    projectSectionDropdownElement.click();
  } else {
    projectIndex = document.querySelector('.main-content.enabled').dataset
      .project;
    if (projectIndex === 'today') {
      projectIndex = '0';
    }
    const projectSectionDropdownElement = document.querySelector(
      `.add-task-box-container.main .project-section-item[data-project="${projectIndex}"][data-section="0"]`,
    );
    projectSectionDropdownElement.click();
  }
}

const selectedProjectSectionDropdown = (() => {
  let selectedProjectSectionButton;
  let dropdown;
  let buttonTop;
  let buttonRight;
  let buttonBottom;
  let buttonLeft;
  let dropdownTop;
  let dropdownLeft;

  function updateValues() {
    selectedProjectSectionButton = document.querySelector(
      '.selected-project-section.active',
    );
    dropdown = document.querySelector(
      '.select-project-section-dropdown-content.show',
    );

    if (selectedProjectSectionButton) {
      buttonTop = selectedProjectSectionButton.getBoundingClientRect().top;
      buttonRight = window.innerWidth
        - selectedProjectSectionButton.getBoundingClientRect().right;
      buttonBottom = window.innerHeight
        - selectedProjectSectionButton.getBoundingClientRect().bottom;
      buttonLeft = selectedProjectSectionButton.getBoundingClientRect().left;
    }
  }

  const getOptimalDropdownPosition = () => {
    updateValues();
    disableDropdownDynamicStyles(dropdown);
    let position;

    const topDropdown = (selectedProjectSectionButton.getBoundingClientRect().top
        - 9
        - dropdown.offsetHeight
        > -0.45 * dropdown.offsetHeight
        && buttonTop + 60 > window.innerHeight)
      || (buttonRight <= 238 && buttonLeft <= 238)
      || isElementInViewport(selectedProjectSectionButton) === false
      ? (position = 'top')
      : false;

    const rightDropdown = topDropdown === false && buttonRight > buttonLeft && buttonRight >= 238
      ? (position = 'right')
      : false;

    const downDropdown = (buttonBottom > buttonTop && buttonRight < 238 && buttonLeft < 238)
      || buttonBottom > dropdown.offsetHeight + 15
      ? (position = 'down')
      : false;
    const leftDropdown = topDropdown === false && buttonLeft > buttonRight && buttonLeft >= 238
      ? (position = 'left')
      : false;

    return position;
  };

  const initialize = () => {
    const dropdownPosition = getOptimalDropdownPosition();

    const initializeDropdown = (() => {
      position(dropdownPosition);
    })();

    setTimeout(() => {
      updateValues();
      if (dropdown) {
        changeSelectProjectSectionDropdownPosition.observe(
          document.querySelector('body'),
        );
      }
    }, 300);
  };

  function position(position) {
    updateValues();
    disableDropdownDynamicStyles(dropdown);
    const dropdownClasses = ['top', 'down'];
    const repeatAnimation = dropdownClasses.some(
      (className) => dropdown.classList.contains(className) && position !== className,
    );
    if (repeatAnimation) {
      dropdown.style.animation = 'none';
    }

    switch (position) {
      case 'top':
        top(dropdown);
        break;

      case 'right':
        right(dropdown);
        break;

      case 'down':
        down(dropdown);
        break;

      case 'left':
        left(dropdown);
        break;
    }

    if (repeatAnimation) {
      setTimeout(() => {}, 4);
      dropdown.style.animation = null;
    }
  }

  function adjustSideDropdownVisibility() {
    const dropdownBottom = window.innerHeight - dropdown.getBoundingClientRect().bottom;

    if (dropdownBottom < 18.5 && dropdownTop < 18.5) {
      dropdown.style.maxHeight = `${window.innerHeight - 20}px`;
      dropdownTop = '12px';
      dropdown.style.top = dropdownTop;
    } else if (dropdownBottom < 18.5) {
      dropdownTop = `${
        parseInt(dropdown.style.top) - Math.abs(18.5 - dropdownBottom) - 10
      }px`;
      if (parseInt(dropdownTop) < 11) {
        dropdownTop = '10px';
      }
      dropdown.style.top = dropdownTop;

      if (
        window.innerHeight > 305 === false
        && dropdown.offsetHeight >= window.innerHeight - 20
      ) {
        dropdown.style.maxHeight = `${window.innerHeight - 20}px`;
        dropdown.style.top = '10px';
      }
    } else if (dropdownTop < 18.5) {
      dropdownTop = `${
        parseInt(dropdown.style.top) + Math.abs(18.5 - dropdownTop) + 10
      }px`;
      if (parseInt(dropdownTop) < 11) {
        dropdownTop = '10px';
      }
      dropdown.style.top = dropdownTop;

      if (
        window.innerHeight > 305 === false
        && dropdown.offsetHeight >= window.innerHeight - 20
      ) {
        dropdown.style.maxHeight = `${window.innerHeight - 20}px`;
        dropdown.style.top = '10px';
      }
    }
  }

  function top(dropdown) {
    dropdown.classList.remove('right', 'down', 'left');
    dropdown.classList.add('top');

    dropdownTop = `${
      selectedProjectSectionButton.getBoundingClientRect().top
      - dropdown.offsetHeight
      - 9
    }px`;
    dropdownLeft = `${
      selectedProjectSectionButton.getBoundingClientRect().left
      + selectedProjectSectionButton.offsetWidth / 2
      - dropdown.offsetWidth / 2
    }px`;

    dropdown.style.top = dropdownTop;
    dropdown.style.left = dropdownLeft;

    if (parseInt(dropdownTop) < 0) {
      dropdown.style.maxHeight = `${
        dropdown.offsetHeight - Math.abs(parseInt(dropdownTop)) - 10
      }px`;
      dropdownTop = '10px';
      dropdown.style.top = dropdownTop;
    }
  }

  function right(dropdown) {
    dropdown.classList.remove('top', 'down', 'left');
    dropdown.classList.add('right');

    dropdownTop = `${
      selectedProjectSectionButton.getBoundingClientRect().bottom
      - 17
      - dropdown.offsetHeight / 2
    }px`;
    dropdownLeft = `${
      selectedProjectSectionButton.getBoundingClientRect().right + 11
    }px`;

    dropdown.style.top = dropdownTop;
    dropdown.style.left = dropdownLeft;
    adjustSideDropdownVisibility();
  }

  function down(dropdown) {
    dropdown.classList.remove('top', 'right', 'left');
    dropdown.classList.add('down');

    const dropdownLeft = `${
      selectedProjectSectionButton.getBoundingClientRect().left
      + selectedProjectSectionButton.offsetWidth / 2
      - 120
    }px`;
    const dropdownTop = `${
      selectedProjectSectionButton.getBoundingClientRect().bottom + 11
    }px`;
    const dropdownBottom = window.innerHeight - parseInt(dropdownTop) - dropdown.offsetHeight;

    const adjustDownDropdownVisibility = (() => {
      if (dropdownBottom < 18.5) {
        dropdown.style.maxHeight = `${
          dropdown.offsetHeight - 20 + dropdownBottom
        }px`;
      }
    })();

    dropdown.style.left = dropdownLeft;
    dropdown.style.top = dropdownTop;
  }

  function left(dropdown) {
    dropdown.classList.remove('top');
    dropdown.classList.add('left');

    dropdownTop = `${
      selectedProjectSectionButton.getBoundingClientRect().bottom
      - 17
      - dropdown.offsetHeight / 2
    }px`;
    dropdownLeft = `${
      selectedProjectSectionButton.getBoundingClientRect().left
      - dropdown.offsetWidth
      - 11
    }px`;

    dropdown.style.top = dropdownTop;
    dropdown.style.left = dropdownLeft;
    adjustSideDropdownVisibility();
  }

  return { initialize, getOptimalDropdownPosition, position };
})();

const changeSelectProjectSectionDropdownPosition = new ResizeObserver(
  (entries) => {
    entries.forEach((entry) => {
      const position = selectedProjectSectionDropdown.getOptimalDropdownPosition();

      selectedProjectSectionDropdown.position(position);

      function changeDropdownIfSidebarIsToggled() {
        const position = selectedProjectSectionDropdown.getOptimalDropdownPosition();

        selectedProjectSectionDropdown.position(position);
      }

      sideBar.addEventListener(
        'transitionend',
        changeDropdownIfSidebarIsToggled,
      );
      setTimeout(() => {
        sideBar.removeEventListener(
          'transitionend',
          changeDropdownIfSidebarIsToggled,
        );
      }, 400);
    });
  },
);

function disableDropdownDynamicStyles(dropdown) {
  dropdown.style.maxHeight = null;
  dropdown.style.top = null;
  dropdown.style.left = null;
}

document.addEventListener('click', (event) => {
  if (event.target.matches('.selected-project-section')) {
    const selectedProjectSectionButton = event.target;
    const dropdown = selectedProjectSectionButton.nextElementSibling;

    dropdown.classList.toggle('show');
    selectedProjectSectionButton.classList.toggle('active');

    if (dropdown.classList.contains('show')) {
      selectedProjectSectionDropdown.initialize();
      disableElementScroll(main);
    } else {
      changeSelectProjectSectionDropdownPosition.disconnect();
      disableDropdownDynamicStyles(dropdown);
      dropdown.classList.remove('top', 'right', 'down', 'left');
      dropdown.scrollTo({ top: 0 });
      enableElementScroll(main);
    }
  }
});

document.addEventListener('click', (event) => {
  if (document.querySelector('.select-project-section-dropdown-content.show')) {
    if (!event.target.matches('.selected-project-section')) {
      changeSelectProjectSectionDropdownPosition.disconnect();
      const selectedProjectSectionButton = document.querySelector(
        '.selected-project-section.active',
      );
      selectedProjectSectionButton.classList.remove('active');

      const dropdown = document.querySelector(
        '.select-project-section-dropdown-content.show',
      );

      disableDropdownDynamicStyles(dropdown);
      dropdown.classList.remove('show', 'top', 'right', 'down', 'left');
      dropdown.scrollTo({ top: 0 });

      if (document.querySelector('.dropdown.show') === null) {
        enableElementScroll(main);
      }
    }
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('.add-task')) {
    const project = event.target.closest('.main-content');
    const sectionContent = event.target.closest('.section-content');
    const section = event.target.closest('section');

    let projectIndex = project.dataset.project;
    if (projectIndex !== 'today') {
      projectIndex = parseInt(projectIndex);
    }
    const sectionIndex = parseInt(section.dataset.section);

    saveTaskBoxTask();

    const addTaskButtons = document.querySelectorAll('.add-task');
    addTaskButtons.forEach((button) => {
      resetAnimation(button);
      button.classList.add('disappearing');
    });

    const addTaskContainer = sectionContent.querySelector(
      '.add-task-container',
    );
    const addTaskBox = createElementFromTemplate(addTaskBoxTemplate);
    addTaskContainer.appendChild(addTaskBox);

    const taskBoxContainer = addTaskContainer.querySelector(
      '.add-task-box-container',
    );

    const selectProjectDropdown = addTaskContainer.querySelector(
      '.select-project-section-dropdown-content ul',
    );
    loadAllProjectsSectionsDropdownElements(selectProjectDropdown);
    initializeSelectProjectSectionDropdown(
      addTaskContainer,
      projectIndex,
      sectionIndex,
    );

    addTaskBoxEventListeners();
  }
});

document.addEventListener('click', (event) => {
  if (
    event.target.matches('.add-task-container .cancel-task')
    || event.target.matches('.edit-task-box-container .cancel-task')
  ) {
    const taskBoxContainer = event.target.closest('.task-box-c');
    const taskActionButton = event.target;

    if (taskActionButton.closest('.edit-task-box-container')) {
      const editTaskBoxContainer = taskActionButton.closest(
        '.edit-task-box-container',
      );
      const taskItem = editTaskBoxContainer.previousElementSibling;
      taskItem.style.display = 'list-item';
    }

    taskBoxContainer.classList.add('disappearing');
    setTimeout(() => {
      taskBoxContainer.remove();

      const addTaskButtons = document.querySelectorAll('.add-task');
      addTaskButtons.forEach((button) => {
        button.classList.remove('disappearing');
        resetAnimation(button);
        button.classList.add('appearing');
      });

      setTimeout(() => {
        addTaskButtons.forEach((button) => {
          button.classList.remove('appearing');
        });
      }, 265);
    }, 255);
  }
});

const changeSelectedPriorityDropdownPosition = new ResizeObserver((entries) => {
  const dropdown = document.querySelector(
    '.select-priority-dropdown-content.show',
  );

  entries.forEach((entry) => {
    const actualPosition = dropdown.classList[3];
    const optimalDropdownPosition = selectPriorityDropdown.getOptimalDropdownPosition();

    selectPriorityDropdown.position(optimalDropdownPosition);
  });
});

const selectPriorityDropdown = (() => {
  let selectedPriorityButton; let
    dropdown;

  function updateValues() {
    selectedPriorityButton = document.querySelector(
      '.selected-priority.active',
    );
    dropdown = document.querySelector('.select-priority-dropdown-content.show');
  }

  function getOptimalDropdownPosition() {
    let position;

    const downDropdown = selectedPriorityButton.getBoundingClientRect().bottom + 148
      < window.innerHeight
      ? (position = 'down')
      : false;
    const downLeftDropdown = downDropdown && selectedPriorityButton.getBoundingClientRect().left < 105
      ? (position = 'down-left')
      : false;

    const topDropdown = !downDropdown ? (position = 'top') : false;
    const topLeftDropdown = topDropdown && selectedPriorityButton.getBoundingClientRect().left < 105
      ? (position = 'top-left')
      : false;

    return position;
  }

  function position(position) {
    const startAnimation = position !== dropdown.classList[3];

    if (startAnimation === true) {
      dropdown.style.animation = 'none';
    }

    switch (position) {
      case 'top':
        top();
        break;

      case 'top-left':
        topLeft();
        break;

      case 'down':
        down();
        break;

      case 'down-left':
        downLeft();
        break;
    }

    if (startAnimation === true) {
      dropdown.style.animation = null;
    }
  }

  function initialize() {
    updateValues();
    const dropdownPosition = getOptimalDropdownPosition();
    position(dropdownPosition);
  }

  function top() {
    dropdown.classList.remove('top-left', 'down', 'down-left');
    dropdown.classList.add('top');

    dropdown.style.top = `${
      selectedPriorityButton.getBoundingClientRect().top - 142
    }px`;
    dropdown.style.left = `${
      selectedPriorityButton.getBoundingClientRect().left - 105
    }px`;
  }

  function topLeft() {
    dropdown.classList.remove('top', 'down', 'down-left');
    dropdown.classList.add('top-left');

    dropdown.style.top = `${
      selectedPriorityButton.getBoundingClientRect().top - dropdown.offsetHeight
    }px`;
    dropdown.style.left = `${
      selectedPriorityButton.getBoundingClientRect().left
    }px`;
  }

  function down() {
    dropdown.classList.remove('top', 'top-left', 'down-left');
    dropdown.classList.add('down');

    dropdown.style.top = `${
      selectedPriorityButton.getBoundingClientRect().bottom - 5
    }px`;
    dropdown.style.left = `${
      selectedPriorityButton.getBoundingClientRect().left - 105
    }px`;
  }

  function downLeft() {
    dropdown.classList.remove('top', 'top-left', 'down');
    dropdown.classList.add('down-left');

    dropdown.style.top = `${
      selectedPriorityButton.getBoundingClientRect().bottom - 5
    }px`;
    dropdown.style.left = `${
      selectedPriorityButton.getBoundingClientRect().left
    }px`;
  }

  return { initialize, getOptimalDropdownPosition, position };
})();

export function addTaskBoxEventListeners() {
  let date;
  const taskBoxContainer = document.querySelector('.task-box-c');

  const selectedPriorityButton = taskBoxContainer.querySelector('.selected-priority');
  const dropdown = taskBoxContainer.querySelector(
    '.select-priority-dropdown-content',
  );
  let sectionContent;
  if (taskBoxContainer.closest('.section-content')) {
    sectionContent = taskBoxContainer.closest('.section-content');
  }

  const initializePriorityOptions = (() => {
    selectedPriorityButton.addEventListener('click', (event) => {
      event.preventDefault();
      toggleSelectPriorityDropdown();
    });
    function toggleSelectPriorityDropdown() {
      selectedPriorityButton.classList.toggle('active');

      if (sectionContent) {
        sectionContent.classList.toggle('overflow-visible');

        if (sectionContent.classList.contains('overflow-visible') === true) {
          disableElementScroll(main);
        } else {
          enableElementScroll(main);
        }
      }

      dropdown.classList.toggle('show');

      if (dropdown.classList.contains('show')) {
        selectPriorityDropdown.initialize();
        changeSelectedPriorityDropdownPosition.observe(
          document.querySelector('body'),
        );
      } else {
        dropdown.classList.remove('top', 'top-left', 'down', 'down-left');
        dropdown.style.top = null;
        dropdown.style.right = null;
        dropdown.style.left = null;
        changeSelectedPriorityDropdownPosition.disconnect();
      }
    }

    const priorityOptions = taskBoxContainer.querySelectorAll('.priority-item');
    priorityOptions.forEach((option) => {
      option.addEventListener('click', () => {
        selectedPriorityButton.dataset.priority = option.dataset.priority;
        selectedPriorityButton.classList.add('selected');
        selectedPriorityButton.addEventListener(
          'animationend',
          () => {
            selectedPriorityButton.classList.remove('selected');
          },
          { once: true },
        );

        priorityOptions.forEach((item) => {
          if (item === option) {
            item.classList.add('selected');
          } else {
            item.classList.remove('selected');
          }
        });
      });
    });
  })();

  const initializeTaskBoxInputs = (() => {
    const taskTitleInput = taskBoxContainer.querySelector('.task-title');
    taskTitleInput.addEventListener('input', enableTaskActionButton, false);
    taskTitleInput.addEventListener(
      'input',
      changeTextareaHeightOnInput,
      false,
    );

    function enableTaskActionButton() {
      const taskActionButton = !isMobile ? this.closest('.task-box-c').querySelector('.action-todo:not(.mobile)') : this.closest('.task-box-c').querySelector('.action-todo');

      if (!/\S/.test(this.value)) {
        taskActionButton.classList.remove('enabled');
      } else {
        taskActionButton.classList.add('enabled');
      }
    }

    function enableTaskBoxFocus() {
      this.closest('.task-box').classList.add('focus');
    }

    function disableTaskBoxFocus() {
      this.closest('.task-box').classList.remove('focus');
    }

    const taskDescriptionInput = document.querySelector(
      '.textarea-task-description',
    );
    taskDescriptionInput.addEventListener(
      'input',
      changeTextareaHeightOnInput,
      false,
    );

    if (taskBoxContainer.classList.contains('main') === false) {
      taskTitleInput.addEventListener('focusin', enableTaskBoxFocus);
      taskTitleInput.addEventListener('focusout', disableTaskBoxFocus);

      taskDescriptionInput.addEventListener('focusin', enableTaskBoxFocus);
      taskDescriptionInput.addEventListener('focusout', disableTaskBoxFocus);
    }

    if (taskBoxContainer.dataset.taskIndex) {
      enableTaskActionButton.call(taskTitleInput);
    }

    if (isMobile) {
      function setStateAsTheLastFocused() {
        const previousFocusedOut = document.querySelector('[data-focused-out]');
        if (previousFocusedOut) {
          previousFocusedOut.removeAttribute('data-focused-out');
        }
        this.dataset.focusedOut = true;
      }
      taskTitleInput.addEventListener(
        'focusout',
        setStateAsTheLastFocused,
        false,
      );

      taskDescriptionInput.addEventListener(
        'focusout',
        setStateAsTheLastFocused,
        false,
      );
    }
  })();

  const initializeDueDateSelector = (() => {
    const projectIndex = document.querySelector('.main-content.enabled').dataset
      .project;
    if (projectIndex === 'today') {
      date = DateTime.local();
    }

    if (taskBoxContainer.dataset.taskIndex) {
      const projectIndex = parseInt(taskBoxContainer.dataset.project);
      const sectionIndex = parseInt(taskBoxContainer.dataset.section);
      const taskIndex = parseInt(taskBoxContainer.dataset.taskIndex);

      const task = toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[
        taskIndex
      ];
      const { dueDate } = task;

      if (dueDate) {
        date = dueDate;
      }
    }

    const dueDateSelector = document.querySelector('.duedate-selector');
    function scheduleInputClass(mutationsList) {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          dueDateSelector.classList.toggle('active');
          if (dueDateSelector.classList.contains('active') === false) {
            dueDateSelector.classList.add('selected');
            dueDateSelector.addEventListener(
              'transitionend',
              () => {
                dueDateSelector.classList.remove('selected');
              },
              { once: true },
            );
          }
        }
      });
    }

    flatpickr('.schedule-input', {
      minDate: 'today',
      defaultDate: typeof date === 'object' ? date.toJSDate() : null,
      disableMobile: 'true',
    });

    const scheduleInputObserver = new MutationObserver(scheduleInputClass);
    const scheduleInput = document.querySelector('.schedule-input');
    scheduleInputObserver.observe(scheduleInput, {
      attributes: true,
    });

    const selectedDueDate = document.querySelector('.selected-duedate');

    scheduleInput.addEventListener('change', () => {
      updateDueDate(scheduleInput, dueDateSelector, selectedDueDate);
    });

    if (date !== '' && date !== undefined) {
      const dateValue = format(date.toJSDate(), 'yyyy-MM-dd');
      scheduleInput.value = dateValue;
      updateDueDate(scheduleInput, dueDateSelector, selectedDueDate);
    }
  })();

  const initializeTaskBox = (() => {
    taskBoxContainer.addEventListener('resetTaskbox', updateTaskBox, false);
    taskBoxContainer.dispatchEvent(resetTaskbox);
  })();
}

document.addEventListener('click', (event) => {
  if (!event.target.matches('.selected-priority')) {
    changeSelectedPriorityDropdownPosition.disconnect();
    if (document.querySelector('.select-priority-dropdown-content.show')) {
      const dropdown = document.querySelector(
        '.select-priority-dropdown-content.show',
      );
      const selectedPriorityButton = document.querySelector(
        '.selected-priority.active',
      );
      selectedPriorityButton.classList.toggle('active');

      if (dropdown.closest('.section-content')) {
        const sectionContent = dropdown.closest('.section-content');
        sectionContent.classList.toggle('overflow-visible');
      }

      dropdown.classList.remove('show', 'top', 'top-left', 'down', 'down-left');
      dropdown.style.top = null;
      dropdown.style.right = null;
      dropdown.style.left = null;
      if (document.querySelector('.dropdown.show') === null) {
        enableElementScroll(main);
      }
    }
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('.edit-task-button')) {
    const editTaskButton = event.target;
    let projectIndex = parseInt(
      editTaskButton.closest('[data-project]').dataset.project,
    );
    let sectionIndex = parseInt(
      editTaskButton.closest('[data-section]').dataset.section,
    );
    let taskIndex = parseInt(
      editTaskButton.closest('[data-task-index]').dataset.taskIndex,
    );
    const { priority } = toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[
      taskIndex
    ];

    let todayID = '';
    let previousTodayID;
    let overdueID = '';
    let previousOverdueID;

    if (editTaskButton.closest('[data-today-id]')) {
      todayID = parseInt(
        editTaskButton.closest('[data-today-id]').dataset.todayId,
      );
    } else if (editTaskButton.closest('[data-overdue-id]')) {
      overdueID = parseInt(
        editTaskButton.closest('[data-overdue-id]').dataset.overdueId,
      );
    }

    const addEditTaskBoxToTheDOM = (() => {
      saveTaskBoxTask();
      const currentTask = editTaskButton.closest('.task-item');
      currentTask.style.display = 'none';
      const editTaskBox = editTaskBoxTemplate(
        projectIndex,
        sectionIndex,
        taskIndex,
      );
      currentTask.insertAdjacentHTML('afterend', editTaskBox);
      addTaskBoxEventListeners();
    })();

    const editTaskContainer = document.querySelector(
      '.edit-task-box-container',
    );
    const selectPriorityButton = editTaskContainer.querySelector(
      `.priority-item[data-priority="${priority}"]`,
    );
    selectPriorityButton.click();

    const initializeSelectedProjectSectionDropdown = (() => {
      const selectProjectSectionDropdown = editTaskContainer.querySelector(
        '.select-project-section-dropdown-content ul',
      );
      loadAllProjectsSectionsDropdownElements(selectProjectSectionDropdown);
      initializeSelectProjectSectionDropdown(
        editTaskContainer,
        projectIndex,
        sectionIndex,
      );
    })();

    const selectedSectionButton = document.querySelector(
      '.edit-task-box-container .selected-project-section',
    );

    let task;
    let title;
    let description;
    let dueDateValue;
    let dueDate;
    let newPriority;
    let index;

    let selectedProjectIndex;
    let selectedSectionIndex;
    let dueDateIsToday;
    let editSavedTodayTask;
    let removeSavedTodayTask;
    let removeOverdueTask;

    function editSavedTask() {
      projectIndex = parseInt(
        editTaskButton.closest('[data-project]').dataset.project,
      );
      sectionIndex = parseInt(
        editTaskButton.closest('[data-section]').dataset.section,
      );
      taskIndex = parseInt(
        editTaskButton.closest('[data-task-index]').dataset.taskIndex,
      );

      title = editTaskContainer.querySelector('.task-title').value;
      description = editTaskContainer.querySelector(
        '.textarea-task-description',
      ).value;
      dueDateValue = editTaskContainer.querySelector('.schedule-input').value;

      if (dueDateValue !== '') {
        const timezoneID = DateTime.local().zoneName;
        dueDate = DateTime.fromFormat(
          `${dueDateValue} 23:59:59`,
          'yyyy-MM-dd hh:mm:ss',
          { zone: timezoneID },
        );
      } else {
        dueDate = '';
      }

      newPriority = parseInt(
        editTaskContainer.querySelector('.selected-priority').dataset.priority,
      );

      toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[
        taskIndex
      ].title = title;
      toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[
        taskIndex
      ].description = description;
      toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[
        taskIndex
      ].dueDate = dueDate;
      toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[
        taskIndex
      ].priority = newPriority;
      toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[
        taskIndex
      ].dueDateTimeZone = DateTime.local().zoneName;

      selectedProjectIndex = parseInt(selectedSectionButton.dataset.project);
      selectedSectionIndex = parseInt(selectedSectionButton.dataset.section);

      task = toDoProjects.projects[projectIndex].sections[sectionIndex].tasks
        .splice(taskIndex, 1)
        .pop();

      toDoProjects.projects[selectedProjectIndex].sections[
        selectedSectionIndex
      ].tasks.push(task);

      index = toDoProjects.projects[selectedProjectIndex].sections[
        selectedSectionIndex
      ].tasks.indexOf(task);

      const today = DateTime.local();

      if (task.dueDate !== '') {
        dueDateIsToday = task.dueDate.startOf('day').ts === today.startOf('day').ts;
      }

      editSavedTodayTask = todayID !== '' && dueDateIsToday;

      removeSavedTodayTask = todayID !== '' && !dueDateIsToday;

      removeOverdueTask = overdueID !== '' && task.dueDate >= today;

      if (removeOverdueTask) {
        deleteOverdueTask(overdueID);

        if (dueDateIsToday) {
          addTodayTask(task);
          todayID = task.todayID;
        }

        previousOverdueID = overdueID;
        overdueID = '';
      }

      if (editSavedTodayTask) {
        toDoProjects.today.tasks.splice(todayID, 1, task);
      } else if (removeSavedTodayTask) {
        deleteTodayTask(todayID);
        previousTodayID = todayID;
        todayID = '';
      } else if (dueDateIsToday) {
        addTodayTask(task);
        todayID = task.todayID;
      }

      saveToDoProjects();
    }

    function addTaskToTheDOM() {
      const previusTasksContainer = document.querySelector(
        `.main-content[data-project="${projectIndex}"] [data-section="${sectionIndex}"] .tasks-items`,
      );

      const tasksContainer = document.querySelector(
        `.main-content[data-project="${selectedProjectIndex}"] [data-section="${selectedSectionIndex}"] .tasks-items`,
      );

      const taskHasNewPosition = tasksContainer !== previusTasksContainer;

      const taskElement = document.querySelector(
        `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] [data-task-index="${taskIndex}"]`,
      );

      taskElement.remove();

      if (removeOverdueTask) {
        deleteOverdueTaskElement(overdueID);
      }

      if (editSavedTodayTask) {
        deleteTodayTaskElement(todayID);
      } else if (removeSavedTodayTask) {
        deleteTodayTaskElement(previousTodayID);
        updateTodayTasksElementsIndixes(previousTodayID, false);
      } else if (dueDateIsToday) {
        updateTodayTasksElementsIndixes(todayID, true);
      } else if (overdueID !== '') {
        deleteOverdueTaskElement(overdueID);
      }

      const taskTemplate = createTaskTemplate(task, index);

      if (taskHasNewPosition === true) {
        const tasksElements = previusTasksContainer.querySelectorAll('.task-item');
        tasksElements.forEach((task) => {
          if (task.dataset.taskIndex > taskIndex) {
            task.dataset.taskIndex -= 1;
          }
        });
        tasksContainer.insertAdjacentHTML('beforeend', taskTemplate);
      } else {
        const previousTask = document.querySelector(
          `.main-content[data-project="${selectedProjectIndex}"] [data-section="${selectedSectionIndex}"] [data-task-index="${
            index - 1
          }"]`,
        );

        if (previousTask) {
          previousTask.insertAdjacentHTML('afterend', taskTemplate);
        } else {
          tasksContainer.insertAdjacentHTML('afterbegin', taskTemplate);
        }
      }

      if (todayID !== '') {
        const taskTemplate = createTaskTemplate(task, index);
        if (todayID === 0) {
          const sectionTasksContainer = document.querySelector(
            '.main-content[data-project="today"] [data-section="0"] .tasks-items',
          );
          sectionTasksContainer.insertAdjacentHTML('afterbegin', taskTemplate);
        } else {
          const previusTask = document.querySelector(
            `.main-content[data-project="today"] [data-section="0"] [data-today-id="${
              todayID - 1
            }"]`,
          );
          previusTask.insertAdjacentHTML('afterend', taskTemplate);
        }
      }

      if (overdueID !== '') {
        const taskTemplate = createTaskTemplate(task, index);
        if (overdueID === 0) {
          const sectionTasksContainer = document.querySelector(
            '.main-content[data-project="today"] [data-section="overdue"] .tasks-items',
          );
          sectionTasksContainer.insertAdjacentHTML('afterbegin', taskTemplate);
        } else {
          const previusTask = document.querySelector(
            `.main-content[data-project="today"] [data-section="overdue"] [data-overdue-id="${
              overdueID - 1
            }"]`,
          );
          previusTask.insertAdjacentHTML('afterend', taskTemplate);
        }
      }

      editTaskContainer.remove();
      updateProjectTasksNumber(projectIndex);
      updateProjectTasksNumber(selectedProjectIndex);
      updateProjectTasksNumber('today');
    }

    const taskTitleInput = document.querySelector('.task-input.task-title');

    function editTask() {
      if (/\S/.test(taskTitleInput.value)) {
        editSavedTask();
        addTaskToTheDOM();
      }
    }

    const editTaskActionButton = document.querySelector('.edit-task');

    editTaskActionButton.addEventListener('click', editTask);
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('.task-checkbox:not(.clicked)')) {
    const taskCheckboxButton = event.target;

    function setTaskCheckboxButtonID() {
      const clickedTaskCheckboxButtons = document.querySelectorAll(
        '.task-checkbox[data-id]',
      );
      const ID = clickedTaskCheckboxButtons.length;
      taskCheckboxButton.dataset.id = ID;
    }

    function waitUntilActualTask(addTask) {
      if (taskCheckboxButton.dataset.id == 0) {
        addTask();
      } else {
        setTimeout(() => {
          waitUntilActualTask(addTask);
        }, 50);
      }
    }

    function updateTaskChekboxButtonsID() {
      const clickedTaskCheckboxButtons = document.querySelectorAll(
        '.task-checkbox[data-id]',
      );
      clickedTaskCheckboxButtons.forEach((task) => {
        task.dataset.id -= 1;
      });
    }

    taskCheckboxButton.classList.add('clicked');
    setTaskCheckboxButtonID();

    let taskElement = taskCheckboxButton.closest('.task-item');

    let projectIndex;
    let sectionIndex;
    let sectionElement;
    let taskIndex;
    let tasksElements;
    let completedTasksElements;
    let sectionTasksContainer;
    let sectionCompletedTasksContainer;

    function setVariablesValues() {
      projectIndex = taskCheckboxButton.closest('[data-project]').dataset.project;
      sectionIndex = taskCheckboxButton.closest('[data-section]').dataset.section;
      sectionElement = document.querySelector(
        `[data-project="${projectIndex}"] section[data-section="${sectionIndex}"]`,
      );
      taskIndex = parseInt(taskElement.dataset.taskIndex);
      tasksElements = [
        ...sectionElement.querySelectorAll('.task-item:not(.completed)'),
        ...document.querySelectorAll(
          `.task-item:not(.completed)[data-project="${projectIndex}"][data-section="${sectionIndex}"]`,
        ),
      ];

      completedTasksElements = sectionElement.querySelectorAll(
        '.task-item.completed',
      );

      sectionTasksContainer = sectionElement.querySelector('.tasks-items');
      sectionCompletedTasksContainer = sectionElement.querySelector(
        '.completed-tasks-items',
      );
    }

    let todayID = '';
    let previousTodayID;
    let todayTaskElement;
    let overdueID = '';
    let previousOverdueID;
    let overdueTaskElement;

    function getDateStatusAndElements() {
      if (taskElement.dataset.todayId != null) {
        todayID = parseInt(taskElement.dataset.todayId);
        taskElement = document.querySelector(
          `[data-project]:not([data-project="today"]) [data-today-id="${todayID}"]`,
        );

        todayTaskElement = document.querySelector(
          `[data-project="today"] [data-today-id="${todayID}"]`,
        );
      } else if (taskElement.dataset.overdueId != null) {
        overdueID = parseInt(taskElement.dataset.overdueId);
        taskElement = document.querySelector(
          `[data-project]:not([data-project="today"]) [data-overdue-id="${overdueID}"`,
        );

        overdueTaskElement = document.querySelector(
          `[data-project="today"] [data-overdue-id="${overdueID}"]`,
        );
      }
    }

    if (taskElement.classList.contains('completed') === false) {
      let completedTask;
      let completedTaskIndex;

      const addCompletedTaskToLocalStorage = () => {
        if (todayID !== '') {
          deleteTodayTask(todayID);
          previousTodayID = todayID;
          todayID = '';
        }

        if (overdueID !== '') {
          deleteOverdueTask(overdueID);
          previousOverdueID = overdueID;
          overdueID = '';
        }

        completedTask = toDoProjects.projects[projectIndex].sections[
          sectionIndex
        ].tasks
          .splice(taskIndex, 1)
          .pop();

        toDoProjects.projects[projectIndex].sections[
          sectionIndex
        ].completedTasks.push(completedTask);

        completedTaskIndex = toDoProjects.projects[projectIndex].sections[
          sectionIndex
        ].completedTasks.indexOf(completedTask);

        saveToDoProjects();
      };

      const addCompletedTaskToTheDOM = () => {
        completedTask = toDoProjects.projects[projectIndex].sections[sectionIndex]
          .completedTasks[completedTaskIndex];

        tasksElements.forEach((task) => {
          if (task.dataset.taskIndex > taskIndex) {
            task.dataset.taskIndex -= 1;
          }
        });

        if (todayTaskElement) {
          updateTodayTasksElementsIndixes(previousTodayID, false);
        } else if (overdueTaskElement) {
          updateOverdueTasksElementsIndixes(overdueID, false);
        }

        setTimeout(() => {
          taskElement.remove();
          updateTaskChekboxButtonsID();

          if (todayTaskElement) {
            todayTaskElement.remove();
            updateProjectTasksNumber('today');
          } else if (overdueTaskElement) {
            overdueTaskElement.remove();
            toggleShowTodaySections();
            updateProjectTasksNumber('today');
          }

          const completedtaskTemplate = createTaskTemplate(
            completedTask,
            completedTaskIndex,
            true,
          );
          const completedTaskElement = createElementFromTemplate(
            completedtaskTemplate,
          );
          sectionCompletedTasksContainer.appendChild(completedTaskElement);
          updateProjectTasksNumber(projectIndex);
        }, 401);
      };

      function addCompletedTask() {
        setVariablesValues();
        getDateStatusAndElements();
        addCompletedTaskToLocalStorage();
        addCompletedTaskToTheDOM();
      }

      taskElement.classList.add('disappearing-with-delay');
      taskCheckboxButton.classList.add('active');
      waitUntilActualTask(addCompletedTask);
    } else {
      let currentTask;
      let currentTaskIndex;
      const today = DateTime.local();

      const addTaskToLocalStorage = () => {
        function addOverdueTask() {
          const taskIndex = getNewOverdueTaskID(currentTask);

          currentTask.overdueID = taskIndex;
          toDoProjects.today.overdueTasks.splice(taskIndex, 0, currentTask);
          updateOverdueTasksIndixes();
          overdueID = taskIndex;
        }

        currentTask = toDoProjects.projects[projectIndex].sections[
          sectionIndex
        ].completedTasks
          .splice(taskIndex, 1)
          .pop();

        if (currentTask.dueDate) {
          if (
            currentTask.dueDate.startOf('day').ts === today.startOf('day').ts
          ) {
            addTodayTask(currentTask);
            todayID = currentTask.todayID;
          } else if (
            currentTask.dueDate < today
            && currentTask.dueDate.startOf('day') < today.startOf('day')
          ) {
            addOverdueTask();
          }
        }

        toDoProjects.projects[projectIndex].sections[sectionIndex].tasks.push(
          currentTask,
        );
        currentTaskIndex = toDoProjects.projects[projectIndex].sections[sectionIndex].tasks
          .length - 1;

        saveToDoProjects();
      };

      const addTaskToTheDOM = () => {
        completedTasksElements.forEach((completedTask) => {
          if (completedTask.dataset.taskIndex > taskIndex) {
            completedTask.dataset.taskIndex -= 1;
          }
        });

        if (todayID !== '') {
          updateTodayTasksElementsIndixes(todayID, true);
        }

        if (overdueID !== '') {
          updateOverdueTasksElementsIndixes(overdueID, true);
        }

        setTimeout(() => {
          taskElement.remove();
          updateTaskChekboxButtonsID();

          const taskTemplate = createTaskTemplate(currentTask, currentTaskIndex);
          taskElement = createElementFromTemplate(taskTemplate);
          sectionTasksContainer.appendChild(taskElement);

          if (todayID || todayID === 0) {
            const taskTemplate = createTaskTemplate(
              currentTask,
              currentTaskIndex,
            );

            if (todayID === 0) {
              const sectionTasksContainer = document.querySelector(
                '.main-content[data-project="today"] [data-section="0"] .tasks-items',
              );
              sectionTasksContainer.insertAdjacentHTML(
                'afterbegin',
                taskTemplate,
              );
            } else {
              const previusTask = document.querySelector(
                `.main-content[data-project="today"] [data-section="0"] [data-today-id="${
                  todayID - 1
                }"]`,
              );
              previusTask.insertAdjacentHTML('afterend', taskTemplate);
            }
            updateProjectTasksNumber('today');
          }

          if (overdueID || overdueID === 0) {
            const taskTemplate = createTaskTemplate(
              currentTask,
              currentTaskIndex,
            );
            if (overdueID === 0) {
              const sectionTasksContainer = document.querySelector(
                '.main-content[data-project="today"] [data-section="overdue"] .tasks-items',
              );
              sectionTasksContainer.insertAdjacentHTML(
                'afterbegin',
                taskTemplate,
              );
            } else {
              const previusTask = document.querySelector(
                `.main-content[data-project="today"] [data-section="overdue"] [data-overdue-id="${
                  overdueID - 1
                }"]`,
              );
              previusTask.insertAdjacentHTML('afterend', taskTemplate);
            }
            toggleShowTodaySections();
            updateProjectTasksNumber('today');
          }
          updateProjectTasksNumber(projectIndex);
        }, 401);
      };

      function addTask() {
        setVariablesValues();
        addTaskToLocalStorage();
        addTaskToTheDOM();
      }

      taskCheckboxButton.classList.add('disable');
      waitUntilActualTask(addTask);
    }
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('.add-todo')) {
    const addTaskButton = event.target;
    const taskTitleInput = document.querySelector('.task-input.task-title');

    if (/\S/.test(taskTitleInput.value)) {
      if (isMobile === false) {
        closeModals();
      }

      const addTaskContainer = event.target.closest('.add-task-box-container');
      const taskBox = addTaskContainer.querySelector('.task-box');
      const selectedPriorityButton = addTaskContainer.querySelector('.selected-priority');
      const selectedSectionButton = addTaskContainer.querySelector(
        '.selected-project-section',
      );

      let index;
      const projectIndex = parseInt(selectedSectionButton.dataset.project);
      const sectionIndex = parseInt(selectedSectionButton.dataset.section);

      const title = addTaskContainer.querySelector('.task-title').value;
      const description = addTaskContainer.querySelector(
        '.add-task-description',
      ).value;

      const scheduleInput = document.querySelector('.schedule-input');
      const dueDateValue = scheduleInput.value;

      let dueDate;
      let dueDateTimeZone;
      if (dueDateValue !== '') {
        const timezoneID = DateTime.local().zoneName;
        dueDate = DateTime.fromFormat(
          `${dueDateValue} 23:59:59`,
          'yyyy-MM-dd hh:mm:ss',
          { zone: timezoneID },
        );
        dueDateTimeZone = dueDate.zoneName;
      } else {
        dueDate = '';
        dueDateTimeZone = '';
      }

      const priority = parseInt(selectedPriorityButton.dataset.priority);
      let task;

      const tasksContainer = document.querySelector(
        `.main-content[data-project="${projectIndex}"] section[data-section="${sectionIndex}"] .tasks-items`,
      );

      function addTask() {
        task = projectCreate.newTask(title, description, dueDate, priority);
        const today = DateTime.local();

        if (task.dueDate !== '') {
          if (task.dueDate.startOf('day').ts === today.startOf('day').ts) {
            const taskIndex = toDoProjects.today.tasks.length;
            task.todayID = taskIndex;
            toDoProjects.today.tasks.push(task);
          }
        }

        task.dueDateTimeZone = dueDateTimeZone;

        toDoProjects.projects[projectIndex].sections[sectionIndex].tasks.push(
          task,
        );
        index = toDoProjects.projects[projectIndex].sections[
          sectionIndex
        ].tasks.indexOf(task);

        saveToDoProjects();
      }

      function addTaskToTheDOM(task, index) {
        const { todayID } = task;
        const taskTemplate = createTaskTemplate(task, index);
        const taskElement = createElementFromTemplate(taskTemplate);
        tasksContainer.appendChild(taskElement);
        const DOMTaskElement = tasksContainer.querySelector(`[data-task-index="${index}"]`);
        DOMTaskElement.style.setProperty(
          '--taskHeight',
          `${DOMTaskElement.offsetHeight}px`,
        );
        resetAnimation(addTaskContainer);
        resetAnimation(taskBox);
        taskBox.classList.add('long-box-shadow-effect');
        DOMTaskElement.classList.add('appearing');
        setTimeout(() => {
          DOMTaskElement.classList.remove('appearing');
        }, 335);
        setTimeout(() => {
          taskBox.classList.remove('long-box-shadow-effect');
        }, 750);
        addTaskContainer.dispatchEvent(resetTaskbox);

        updateProjectTasksNumber(projectIndex);

        if (todayID !== '') {
          const tasksContainer = document.querySelector(
            '.main-content[data-project="today"] [data-section="0"] .tasks-items',
          );
          const taskTemplate = createTaskTemplate(task, index);
          const taskElement = createElementFromTemplate(taskTemplate);
          tasksContainer.appendChild(taskElement);
          updateProjectTasksNumber('today');
        }
      }

      addTask();
      addTaskToTheDOM(task, index);
      closeModals();
    }
  }
});

//

const quickAddButtonElement = document.querySelector('.quick-add');
quickAddButtonElement.addEventListener('click', (e) => {
  e.preventDefault();

  const setLastHeightProperty = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const taskBox = entry.target;
      const height = taskBox.offsetHeight;

      taskBox.style.setProperty('--lastHeight', `${height}px`);
    });
  });

  setLastHeightProperty.observe(mainAddTaskBoxContainer);

  setTimeout(() => {
    const taskTitleInput = document.querySelector('.task-input.task-title');
    taskTitleInput.focus();
  }, 20);

  setTimeout(() => {
    const root = document.documentElement;
    let previousKeyboardHeight;

    function addClassToTaskBoxModalIfKeyboardShrinks(mutationList) {
      mutationList.forEach((mutation) => {
        const currentKeyboardHeight = parseInt(
          mutation.target.style.getPropertyValue('--actualKeyboardHeight'),
        );

        if (currentKeyboardHeight === previousKeyboardHeight) return;

        if (currentKeyboardHeight < previousKeyboardHeight) {
          mainAddTaskBoxContainer.classList.add('.shrinking-size');
        } else {
          mainAddTaskBoxContainer.classList.remove('.shrinking-size');
        }

        previousKeyboardHeight = currentKeyboardHeight;
      });
    }

    const options = {
      attributes: true,
      attributeFilter: ['style'],
    };

    const taskBoxObserver = new MutationObserver(
      addClassToTaskBoxModalIfKeyboardShrinks,
    );
    taskBoxObserver.observe(root, options);

    function adjustElementsHeight() {
      let maximumWaitTime = false;
      const virtualKeyboardWindowHeight = virtualKeyboard.windowHeightMatches();
      const delay = virtualKeyboardWindowHeight ? 0 : 4;

      setTimeout(() => {
        (async function adjustElementsHeight() {
          while (true) {
            const root = document.documentElement;

            if (
              virtualKeyboardWindowHeight
              || virtualKeyboard.changing === false
            ) {
              if (virtualKeyboardWindowHeight || virtualKeyboard.isOnScreen) {
                return;
              }

              if (mainAddTaskBoxContainer.classList.contains('active')) {
                root.style.setProperty('--lastKeyboardHeight', '0px');
              } else {
                setTimeout(() => {
                  root.style.setProperty('--lastKeyboardHeight', '0px');
                }, 200);
              }

              return;
            }
            if (maximumWaitTime) return;
            await new Promise((resolve) => setTimeout(resolve, 4));
          }
        }());
      }, delay);

      setTimeout(() => {
        maximumWaitTime = true;
      }, 300);
    }

    window.addEventListener('resize', adjustElementsHeight);
  }, 250);
});

window.addEventListener('popstate', goBackAction);

function goBackAction() {
  if (document.querySelector('.modal.active')) {
    setTimeout(() => {
      if (window.history.state === null) {
        window.history.pushState({ id: 1 }, null, '?q=1234&u=beware');
      }
    }, 50);
  } else if (document.querySelector('.sidebar.open')) {
    document.querySelector('.nav-button').click();
  }
}
