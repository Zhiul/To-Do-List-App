import { format } from "date-fns";
import * as OverlayScrollbars from "overlayscrollbars";
import { isMobile } from "./mobile";
import {
  toDoProjects,
  addTodayTask,
  updateTodayTasksIndixes,
  updateOverdueTasksIndixes,
  getNewTodayTaskID,
  getNewOverdueTaskID,
} from "./logic.js";
import { addTaskBoxEventListeners } from "./task";
import {
  toggleEmptyState,
  updateProjectTasksNumber,
  toggleShowTodaySections,
  loadAllProjectsSectionsDropdownElements,
  main,
} from "./utilities";
import {
  createElementFromTemplate,
  createProjectTemplate,
  createSectionTemplate,
  createTaskTemplate,
  createProjectSidebarTemplate,
} from "./elementsTemplates.js";
import {
  addSetSectionsMaxHeightEL,
  sidebarProjectsList,
  addSetCompletedTasksContainerMaxHeightEL,
} from "./project.js";

const { DateTime } = require("luxon");

export { firstPageLoad };

document.addEventListener("DOMContentLoaded", () => {
  const loadingScreenElement = document.querySelector(".loading-screen");
  loadingScreenElement.classList.add("fade");
  setTimeout(() => {
    loadingScreenElement.remove();
  }, 300);
});

const mainObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const classNames = [
        "main-to-do-list",
        "tasks-items",
        "completed-tasks-items",
      ];

      if (
        classNames.some((className) =>
          mutation.target.classList.contains(className)
        )
      ) {
        const projectIndex =
          mutation.target.closest("[data-project]").dataset.project;
        if (projectIndex !== "today") {
          toggleEmptyState(projectIndex);
        }
      }
    }
  });
});

const config = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: true,
};

mainObserver.observe(main, config);

function sortTasksElements(container, reverse, dataAttribute) {
  const order = reverse ? -1 : 1;

  Array.from(container.children)
    .sort(
      (a, b) =>
        order * parseInt(a.dataset[dataAttribute]) -
        order * parseInt(b.dataset[dataAttribute])
    )
    .forEach((element) => container.appendChild(element));
}

function updateTaskDueDateAccordingToTimezone(task) {
  const now = DateTime.local();
  const { dueDateTimeZone } = task;
  task.dueDate = DateTime.fromISO(task.dueDate.toString());
  const { dueDate } = task;

  if (dueDateTimeZone !== now.zoneName) {
    dueDate.second === 59
      ? (task.dueDate = dueDate.plus({ seconds: 1 }))
      : false;
  } else {
    dueDate.second === 0
      ? (task.dueDate = dueDate.minus({ seconds: 1 }))
      : false;
  }
}

const loadOverdueTasks = () => {
  const today = DateTime.local();
  const tasks = toDoProjects.today.overdueTasks;
  const todayTasks = toDoProjects.today.tasks;

  for (let i = tasks.length - 1; i >= 0; i--) {
    const task = tasks[i];
    const { overdueID } = task;

    updateTaskDueDateAccordingToTimezone(task);

    if (task.dueDate.startOf("day").ts === today.startOf("day").ts) {
      task.overdueID = "";
      const todayTask = tasks.splice(overdueID, 1).pop();
      updateOverdueTasksIndixes();

      const taskIndex = getNewTodayTaskID(task);

      todayTask.todayID = taskIndex;
      todayTasks.splice(taskIndex, 0, todayTask);
      updateTodayTasksIndixes();
    }
  }
};

const loadTodayTasks = () => {
  const today = DateTime.local();
  const { tasks } = toDoProjects.today;
  const { overdueTasks } = toDoProjects.today;

  for (let i = tasks.length - 1; i >= 0; i--) {
    const task = tasks[i];
    const { todayID } = task;

    updateTaskDueDateAccordingToTimezone(task);

    if (task.dueDate.startOf("day") < today.startOf("day")) {
      task.todayID = "";
      const overdueTask = tasks.splice(todayID, 1).pop();
      updateTodayTasksIndixes();

      const taskIndex = getNewOverdueTaskID(task);

      overdueTask.overdueID = taskIndex;
      overdueTasks.splice(taskIndex, 0, overdueTask);
      updateOverdueTasksIndixes();
    } else if (task.dueDate.startOf("day") > today.startOf("day")) {
      task.todayID = "";
      tasks.splice(todayID, 1);
      updateTodayTasksIndixes();
    }
  }
};

const homeButton = document.querySelector("#home-button");
homeButton.addEventListener("click", openTodayProject);

function openTodayProject() {
  const todayItem = document.querySelector(
    '.sidebar-item[data-project="today"]'
  );
  todayItem.click();
}

function updateTasksInRealTime() {
  function updateTasks(previousDay, newTimezone) {
    const now = new Date();
    const actualDay = now.getDate();

    if (actualDay !== previousDay || newTimezone) {
      previousDay = actualDay;

      const updateTodayProjectTasks = (() => {
        loadOverdueTasks();
        loadTodayTasks();

        const loadNewTodayTasks = (() => {
          toDoProjects.projects.forEach((project) => {
            project.sections.forEach((section) => {
              const { tasks } = section;
              tasks.forEach((task) => {
                const { todayID } = task;
                const { dueDate } = task;
                const today = DateTime.local();

                if (dueDate !== "") {
                  if (
                    dueDate.startOf("day").ts === today.startOf("day").ts &&
                    todayID === ""
                  ) {
                    addTodayTask(task);
                  }
                }
              });
            });
          });
        })();
      })();

      const changeTodayProjectDatesElements = (() => {
        const todayTasksSectionTitle = document.querySelector(
          '[data-project="today"] [data-section="0"] .section-title'
        );
        const todayIconText = document.querySelector(
          '[data-project="today"] text tspan'
        );

        todayIconText.textContent = `${format(new Date(), "dd")}`;
        todayTasksSectionTitle.textContent = `${format(
          new Date(),
          "LLL d"
        )} ‧ Today`;
        updateProjectTasksNumber("today");
      })();

      const updateTodayProjectElements = (() => {
        const todaySectionTasksContainer = document.querySelector(
          '[data-project="today"] [data-section="0"] .tasks-items'
        );

        const overdueSectionTasksContainer = document.querySelector(
          '[data-section="overdue"] .tasks-items'
        );

        const newOverdueSectionTasksContainer =
          overdueSectionTasksContainer.cloneNode();

        const newTodaySectionTasksContainer =
          todaySectionTasksContainer.cloneNode();

        const taskElements = document.querySelectorAll(".task-item");
        taskElements.forEach((task) => {
          task.removeAttribute("data-overdue-id");
          task.removeAttribute("data-today-id");
        });

        toDoProjects.projects.forEach((project, projectIndex) => {
          project.sections.forEach((section, sectionIndex) => {
            section.tasks.forEach((task, index) => {
              const { todayID } = task;
              const { overdueID } = task;

              const taskElementInProject = document.querySelector(
                `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] [data-task-index="${index}"]`
              );

              if (todayID !== "") {
                taskElementInProject.dataset.todayId = todayID;
                const taskTemplate = createTaskTemplate(task, index);
                const taskElement = createElementFromTemplate(taskTemplate);
                newTodaySectionTasksContainer.appendChild(taskElement);
              } else if (overdueID !== "") {
                taskElementInProject.dataset.overdueId = overdueID;
                const taskTemplate = createTaskTemplate(task, index);
                const taskElement = createElementFromTemplate(taskTemplate);
                newOverdueSectionTasksContainer.appendChild(taskElement);
              }
            });
          });
        });

        sortTasksElements(newTodaySectionTasksContainer, false, "todayId");
        sortTasksElements(newOverdueSectionTasksContainer, false, "overdueId");

        todaySectionTasksContainer.replaceWith(newTodaySectionTasksContainer);
        overdueSectionTasksContainer.replaceWith(
          newOverdueSectionTasksContainer
        );
      })();

      const updateTasksDatesElements = (() => {
        toDoProjects.projects.forEach((project, projectIndex) => {
          project.sections.forEach((section, sectionIndex) => {
            const { tasks } = section;
            const { completedTasks } = section;
            const actualTimezone = DateTime.local().zoneName;
            const today = DateTime.local();

            function changeTaskDuedateElement(task, taskIndex, completed) {
              const { dueDate } = task;
              if (dueDate) {
                const { dueDateTimeZone } = task;
                let dueDateClass;
                let dueDateContent;

                if (dueDate.startOf("day").ts === today.startOf("day").ts) {
                  dueDateClass = "today";
                  dueDateContent = "Today";
                } else if (dueDate.year === today.year) {
                  dueDateClass = "date";
                  dueDateContent = format(dueDate.toJSDate(), "LLL d");
                } else {
                  dueDateClass = "date";
                  dueDateContent = format(dueDate.toJSDate(), "LLL d uuuu");
                }

                if (dueDate < now) {
                  dueDateClass = "overdue";
                }

                const changeTaskDuedateElement = (() => {
                  let taskElement;
                  if (completed) {
                    taskElement = document.querySelector(
                      `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] [data-task-index="${taskIndex}"].completed`
                    );
                  } else {
                    taskElement = document.querySelector(
                      `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] [data-task-index="${taskIndex}"]`
                    );
                  }

                  const taskDueDateButton = taskElement.querySelector(
                    ".task-duedate-button"
                  );
                  const taskDueDateContent = taskElement.querySelector(
                    ".task-duedate-content"
                  );
                  const timezoneElement =
                    taskElement.querySelector(".timezone");

                  taskDueDateButton.classList.value = `task-duedate-button active ${dueDateClass}`;
                  taskDueDateContent.textContent = dueDateContent;

                  if (dueDateTimeZone === actualTimezone) {
                    timezoneElement.classList.value = "timezone disabled";
                  } else {
                    timezoneElement.classList.value = "timezone active";
                  }
                })();
              }
            }

            tasks.forEach((task, taskIndex) => {
              changeTaskDuedateElement(task, taskIndex);
            });

            completedTasks.forEach((task, taskIndex) => {
              changeTaskDuedateElement(task, taskIndex, true);
            });
          });
        });
      })();
    }

    if (!newTimezone) {
      const now = new Date();
      const delay = 60000 - (now % 60000);
      setTimeout(() => {
        updateTasksIfDayIsOver(previousDay);
      }, delay);
    }
  }

  function updateTasksIfNewTimezone(
    previousTimezone = DateTime.local().zoneName
  ) {
    const actualTimeZone = DateTime.local().zoneName;

    if (previousTimezone !== actualTimeZone) {
      previousTimezone = actualTimeZone;
      toDoProjects.projects.forEach((project) => {
        project.sections.forEach((section) => {
          section.tasks.forEach((task) => {
            if (task.dueDate) {
              updateTaskDueDateAccordingToTimezone(task);
            }
          });
        });
      });
      const previousDay = DateTime.local().setZone(previousTimezone).day;
      updateTasks(previousDay, true);
    }
    setTimeout(() => {
      updateTasksIfNewTimezone(previousTimezone);
    }, 5000);
  }
  updateTasksIfNewTimezone();

  let updateTasksIfDayIsOver = (previousDay = new Date().getDate()) => {
    updateTasks(previousDay);
  };
  updateTasksIfDayIsOver();

  function updateOverdueTodayTasksElements() {
    toDoProjects.today.tasks.forEach((task) => {
      if (task.dueDate < now) {
        const { todayID } = task;

        const changeTaskElementDuedateStatus = (() => {
          const taskElement = document.querySelector(
            `[data-project]:not([data-project="today"]) [data-today-id="${todayID}"]`
          );

          const taskDueDateButton = taskElement.querySelector(
            ".task-duedate-button"
          );

          taskDueDateButton.classList.value =
            "task-duedate-button active overdue";
        })();

        const changeTodayTaskElementDueDateStatus = (() => {
          const todayTaskElement = document.querySelector(
            `[data-project="today"] [data-today-id="${todayID}"]`
          );

          const taskDueDateButton = taskElement.querySelector(
            ".task-duedate-button"
          );

          taskDueDateButton.classList.value =
            "task-duedate-button active overdue";
        })();
      }
    });

    const now = new Date();
    const delay = 60000 - (now % 60000);

    setTimeout(() => {
      updateOverdueTodayTasksElements();
    }, delay);
  }
}

const firstPageLoad = (() => {
  (function addMobileAndTabletStyles() {
    if (isMobile) {
    } else {
      document.querySelector("#mobile-stylesheet").remove();
    }
  })();

  function watchForHover() {
    let lastTouchTime = 0;

    function enableHover() {
      if (
        new Date() - lastTouchTime < 500 ||
        document.querySelector("*:active")
      ) {
        return;
      }
      document.body.classList.add("no-touch");
    }

    function disableHover() {
      document.body.classList.remove("no-touch");
    }

    function updateLastTouchTime() {
      lastTouchTime = new Date();
    }

    document.addEventListener("touchstart", updateLastTouchTime, true);
    document.addEventListener("touchstart", disableHover, true);
    document.addEventListener("mousemove", enableHover, true);

    enableHover();
  }

  watchForHover();

  addTaskBoxEventListeners();
  const selectProjectSectionDropdown = document.querySelector(
    ".select-project-section-dropdown-content ul"
  );
  loadAllProjectsSectionsDropdownElements(selectProjectSectionDropdown);
  updateTasksInRealTime();
  OverlayScrollbars(document.querySelector(".sidebar"), {
    overflowBehavior: {
      x: "scroll",
      y: "scroll",
    },
  });

  const todayTasksContainer = document.querySelector(
    '.main-content[data-project="today"] [data-section="0"] .tasks-items'
  );
  const overdueTasksContainer = document.querySelector(
    '.main-content[data-project="today"] [data-section="overdue"] .tasks-items'
  );

  const linkTodayProjectTasksToProjects = (() => {
    function linkTasks(section) {
      const { tasks } = section;

      tasks.forEach((task, index, tasks) => {
        if (task.todayID !== "") {
          const { todayID } = task;
          tasks[index] = toDoProjects.today.tasks[todayID];
        }

        if (task.overdueID !== "") {
          const { overdueID } = task;
          tasks[index] = toDoProjects.today.overdueTasks[overdueID];
        }
      });
    }

    toDoProjects.projects.forEach((project) => {
      project.sections.forEach((section) => {
        linkTasks(section);
      });
    });
  })();

  const parseTodayTasksDates = (() => {
    function convertISODatetoDateTime(task) {
      task.creationDate = new Date(task.creationDate);
      task.dueDate = DateTime.fromISO(task.dueDate);
    }

    toDoProjects.today.tasks.forEach((task) => {
      convertISODatetoDateTime(task);
    });

    toDoProjects.today.overdueTasks.forEach((task) => {
      convertISODatetoDateTime(task);
    });
  })();

  loadOverdueTasks();
  loadTodayTasks();

  function addSectionToTheDOM(section, sectionIndex, projectIndex) {
    const projectElement = document.querySelector(
      `.main-content[data-project="${projectIndex}"] .main-to-do-list`
    );

    let expandStatus;
    if (section.expanded === true) {
      expandStatus = "active";
    } else {
      expandStatus = "disabled";
    }

    let sectionTasksContainer;
    let sectionCompletedTasksContainer;

    if (sectionIndex === 0) {
      sectionTasksContainer = projectElement.querySelector(
        'section[data-section="0"] .tasks-items'
      );
      sectionCompletedTasksContainer = projectElement.querySelector(
        'section[data-section="0"] .completed-tasks-items'
      );
    } else {
      const sectionTitle = section.title;
      const sectionTemplate = createSectionTemplate(
        sectionIndex,
        sectionTitle,
        expandStatus
      );
      const sectionElement = createElementFromTemplate(sectionTemplate);
      projectElement.appendChild(sectionElement);

      sectionTasksContainer = projectElement.querySelector(
        `section[data-section="${sectionIndex}"] .tasks-items`
      );
      sectionCompletedTasksContainer = projectElement.querySelector(
        `section[data-section="${sectionIndex}"] .completed-tasks-items`
      );
    }

    section.tasks.forEach((task, index) => {
      task.creationDate = new Date(task.creationDate);
      if (task.dueDate !== "") {
        task.dueDate = DateTime.fromISO(task.dueDate);
      }

      const now = DateTime.local();

      let { dueDate } = task;
      let { todayID } = task;
      let { overdueID } = task;

      if (dueDate) {
        updateTaskDueDateAccordingToTimezone(task);
        dueDate = task.dueDate;

        const addTaskToTodayProject = (() => {
          if (dueDate.startOf("day") < now.startOf("day") && overdueID === "") {
            const taskIndex = getNewOverdueTaskID(task);

            task.overdueID = taskIndex;
            toDoProjects.today.overdueTasks.splice(taskIndex, 0, task);

            toDoProjects.today.overdueTasks.forEach((task) => {
              task.overdueID = toDoProjects.today.overdueTasks.indexOf(task);
            });

            overdueID = taskIndex;
          } else if (
            dueDate.startOf("day").ts === now.startOf("day").ts &&
            todayID === ""
          ) {
            addTodayTask(task);
            todayID = task.todayID;
          }
        })();
      }

      const addTaskElementToSection = (() => {
        const taskTemplate = createTaskTemplate(task, index);
        const taskElement = createElementFromTemplate(taskTemplate);
        sectionTasksContainer.appendChild(taskElement);
      })();

      const addTaskElementToTodayProject = (() => {
        if (todayID !== "") {
          const taskTemplate = createTaskTemplate(task, index);
          const taskElement = createElementFromTemplate(taskTemplate);
          todayTasksContainer.appendChild(taskElement);

          const projectIndex = "today";
          updateProjectTasksNumber(projectIndex);
        }

        if (overdueID !== "") {
          const taskTemplate = createTaskTemplate(task, index);
          const taskElement = createElementFromTemplate(taskTemplate);
          overdueTasksContainer.appendChild(taskElement);

          const projectIndex = "today";
          updateProjectTasksNumber(projectIndex);
        }
      })();
    });

    section.completedTasks.forEach((task, index) => {
      task.creationDate = new Date(task.creationDate);
      if (task.dueDate !== "") {
        task.dueDate = DateTime.fromISO(task.dueDate);
      }

      const addTaskElementToSection = (() => {
        const taskTemplate = createTaskTemplate(task, index, true);
        const taskElement = createElementFromTemplate(taskTemplate);
        sectionCompletedTasksContainer.appendChild(taskElement);
      })();
    });

    toggleEmptyState(projectIndex);
  }

  const addProjectsToTheDOM = (() => {
    toDoProjects.projects.forEach((project, projectIndex) => {
      const { title } = project;
      const commentsNumber = project.comments.length;

      const projectTemplate = createProjectTemplate(
        title,
        projectIndex,
        commentsNumber
      );

      const projectElement = createElementFromTemplate(projectTemplate);
      main.appendChild(projectElement);

      const addSectionsToTheDOM = (() => {
        project.sections.forEach((section, sectionIndex) => {
          addSectionToTheDOM(section, sectionIndex, projectIndex);
        });
      })();

      const initializeProjectSidebarElement = (() => {
        const { color } = project;
        let tasksNumber = 0;

        project.sections.forEach((section) => {
          tasksNumber += section.tasks.length;
        });

        if (tasksNumber === 0) {
          tasksNumber = "";
        }

        if (projectIndex === 0) {
          const tasksNumberElement = document.querySelector(
            '.main-filters-item[data-project="0"] .item-number'
          );
          tasksNumberElement.textContent = tasksNumber;
        } else {
          const projectSidebarTemplate = createProjectSidebarTemplate(
            projectIndex,
            color,
            title,
            tasksNumber
          );

          const projectSidebarElement = createElementFromTemplate(
            projectSidebarTemplate
          );

          sidebarProjectsList.appendChild(projectSidebarElement);
        }
      })();
    });
  })();

  addSetSectionsMaxHeightEL();
  addSetCompletedTasksContainerMaxHeightEL();

  const loadTodayProjectElements = (() => {
    let itemsNumber = 0;

    Object.keys(toDoProjects.today).forEach((key) => {
      itemsNumber += toDoProjects.today[key].length;
    });

    const tasksNumberElement = document.querySelector(
      '.main-filters-item[data-project="today"] .item-number'
    );

    const todayIconText = document.querySelector(
      '[data-project="today"] text tspan'
    );
    todayIconText.textContent = `${format(new Date(), "dd")}`;

    if (itemsNumber === 0) {
      itemsNumber = "";
    }
    tasksNumberElement.textContent = itemsNumber;

    const sectionTitle = document.querySelector(
      '[data-project="today"] [data-section="0"] .section-title'
    );
    sectionTitle.textContent = `${format(new Date(), "LLL d")} ‧ Today`;
  })();

  sortTasksElements(todayTasksContainer, false, "todayId");
  sortTasksElements(overdueTasksContainer, false, "overdueId");

  toggleShowTodaySections();
  toggleEmptyState("today");
})();
