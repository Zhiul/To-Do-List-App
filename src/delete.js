import {
  toDoProjects,
  deleteTodayTask,
  deleteOverdueTask,
  saveToDoProjects,
} from "./logic";
import {
  updateProjectTasksNumber,
  toggleShowTodaySections,
  updateTodayTasksElementsIndixes,
  updateOverdueTasksElementsIndixes,
  deleteTodayTaskElement,
  deleteOverdueTaskElement,
} from "./utilities";

export const initializeDeleteEventListeners = (() => {
  document.addEventListener("click", (event) => {
    if (event.target.matches(".delete-project")) {
      const deleteProjectOption = event.target;
      const deleteProjectModal = document.querySelector(".delete-modal");
      let sidebarProjectItem = document.querySelector(".project-item.active");

      let projectIndex;

      deleteProjectModal.removeAttribute("data-section");
      deleteProjectModal.removeAttribute("data-task-index");
      deleteProjectModal.removeAttribute("data-comment-index");

      if (sidebarProjectItem) {
        projectIndex = parseInt(sidebarProjectItem.dataset.project);
      } else {
        projectIndex = parseInt(
          document.querySelector(".main-content.enabled").dataset.project
        );
      }

      if (projectIndex !== 0) {
        const deleteProjectModalTitle =
          deleteProjectModal.querySelector(".item-title");

        deleteProjectModal.dataset.project = projectIndex;
        deleteProjectModalTitle.textContent =
          toDoProjects.projects[projectIndex].title;
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches(".delete-task")) {
      const deleteTaskButton = event.target;
      const deleteTaskModal = document.querySelector(".delete-modal");

      const projectIndex =
        deleteTaskButton.closest("[data-project]").dataset.project;
      const sectionIndex = parseInt(
        deleteTaskButton.closest("[data-section]").dataset.section
      );
      const taskIndex = parseInt(
        deleteTaskButton.closest("[data-task-index]").dataset.taskIndex
      );
      const completedTask = deleteTaskButton.closest(".completed");

      const deleteTaskModalTitle = deleteTaskModal.querySelector(".item-title");

      deleteTaskModal.removeAttribute("data-comment-index");
      deleteTaskModal.dataset.project = projectIndex;
      deleteTaskModal.dataset.section = sectionIndex;
      deleteTaskModal.dataset.taskIndex = taskIndex;

      if (completedTask) {
        deleteTaskModal.dataset.completedTask = "true";
        deleteTaskModalTitle.textContent =
          toDoProjects.projects[projectIndex].sections[
            sectionIndex
          ].completedTasks[taskIndex].title;
      } else {
        deleteTaskModalTitle.textContent =
          toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[
            taskIndex
          ].title;
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches(".delete-comment")) {
      const deleteCommentButton = event.target;
      const deleteCommentModal = document.querySelector(".delete-modal");

      const commentIndex = parseInt(
        deleteCommentButton.closest("[data-index]").dataset.index
      );
      const projectIndex = parseInt(
        document.querySelector(".main-content.enabled").dataset.project
      );

      deleteCommentModal.dataset.project = projectIndex;
      deleteCommentModal.dataset.commentIndex = commentIndex;

      const deleteTaskModalTitle =
        deleteCommentModal.querySelector(".item-title");
      deleteTaskModalTitle.textContent = "this";
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches(".delete-section")) {
      const deleteSectionButton = event.target;
      const deleteSectionModal = document.querySelector(".delete-modal");
      const sectionIndex = parseInt(
        deleteSectionButton.closest("[data-section]").dataset.section
      );
      const projectIndex = parseInt(
        document.querySelector(".main-content.enabled").dataset.project
      );
      const sectionTitle =
        toDoProjects.projects[projectIndex].sections[sectionIndex].title;

      deleteSectionModal.removeAttribute("data-task-index");
      deleteSectionModal.removeAttribute("data-comment-index");
      deleteSectionModal.dataset.project = projectIndex;
      deleteSectionModal.dataset.section = sectionIndex;

      const deleteSectionModalTitle =
        deleteSectionModal.querySelector(".item-title");
      deleteSectionModalTitle.textContent = sectionTitle;
    }
  });

  const deleteButton = document.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => {
    const deleteModal = document.querySelector(".delete-modal");
    const projectIndex = +deleteModal.dataset.project;
    const sectionIndex = +deleteModal.dataset.section;

    const actualProjectIndex = parseInt(
      document.querySelector(".main-content.enabled").dataset.project
    );

    const deleteProjectMode =
      deleteModal.dataset.project &&
      !deleteModal.dataset.section &&
      !deleteModal.dataset.taskIndex &&
      !deleteModal.dataset.commentIndex;
    const deleteTaskMode =
      deleteModal.dataset.project && deleteModal.dataset.taskIndex;
    const deleteProjectCommentMode =
      deleteModal.dataset.project && deleteModal.dataset.commentIndex;
    const deleteSectionMode =
      deleteModal.dataset.project && deleteModal.dataset.section;

    function makeAddTasksButtonsAppear() {
      if (
        document.querySelector(".add-task-box-container:not(.main)") &&
        document.querySelector(".add-task.disappearing")
      )
        return;
      const addTaskButtons = document.querySelectorAll(".add-task");
      addTaskButtons.forEach((button) => {
        button.classList.remove("disappearing");
        button.classList.add("appearing");
      });
    }

    if (deleteProjectMode) {
      if (projectIndex === 0) return;
      toDoProjects.projects.splice(projectIndex, 1);

      const projectTodayTasksElements = document.querySelectorAll(
        `[data-project="${projectIndex}"][data-today-id]`
      );

      const projectOverdueTasksElements = document.querySelectorAll(
        `[data-project="${projectIndex}"][data-overdue-id]`
      );

      projectTodayTasksElements.forEach((task) => {
        const todayID = parseInt(task.dataset.todayId);
        deleteTodayTask(todayID);
        updateTodayTasksElementsIndixes(todayID, false);
      });

      projectOverdueTasksElements.forEach((task) => {
        const overdueID = parseInt(task.dataset.overdueId);
        deleteOverdueTask(overdueID);
        updateOverdueTasksIndixes(overdueID);
      });

      const projectElements = document.querySelectorAll(
        `[data-project="${projectIndex}"]`
      );
      const inboxProjectItem = document.querySelector(
        '.sidebar-item[data-project="0"]'
      );

      projectElements.forEach((projectElement) => {
        if (
          !projectElement.matches(".delete-modal") &&
          !projectElement.matches(".sidebar-item")
        ) {
          projectElement.remove();
        }
      });

      const sidebarProjectItem = document.querySelector(
        `.sidebar-item[data-project="${projectIndex}"]`
      );

      sidebarProjectItem.classList.add("disappearing");
      sidebarProjectItem.addEventListener("animationend", () => {
        sidebarProjectItem.remove();
      });

      const projectsElements = document.querySelectorAll("[data-project]");
      projectsElements.forEach((projectElement) => {
        if (projectElement.dataset.project > projectIndex) {
          projectElement.dataset.project -= 1;
        }
      });

      if (actualProjectIndex == projectIndex) {
        inboxProjectItem.click();
      }

      toggleShowTodaySections();
    } else if (deleteTaskMode) {
      const taskIndex = +deleteModal.dataset.taskIndex;
      const { completedTask } = deleteModal.dataset;

      let taskElement;
      let tasksElements;

      if (completedTask) {
        taskElement = document.querySelector(
          `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] [data-task-index="${taskIndex}"].completed`
        );
        tasksElements = document.querySelectorAll(
          `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] [data-task-index].completed`
        );
      } else {
        taskElement = document.querySelector(
          `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] [data-task-index="${taskIndex}"]`
        );
        tasksElements = document.querySelectorAll(
          `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] .task-item:not(.completed), .task-item:not(.completed)[data-project="${projectIndex}"][data-section="${sectionIndex}"]`
        );
      }

      const deleteTask = (() => {
        if (taskElement.classList.contains("completed") === false) {
          toDoProjects.projects[projectIndex].sections[
            sectionIndex
          ].tasks.splice(taskIndex, 1);
        } else {
          toDoProjects.projects[projectIndex].sections[
            sectionIndex
          ].completedTasks.splice(taskIndex, 1);
        }
      })();

      const deleteTaskElements = (() => {
        if (taskElement.dataset.todayId) {
          const todayID = parseInt(taskElement.dataset.todayId);
          deleteTodayTask(todayID);
          deleteTodayTaskElement(todayID);
        }

        if (taskElement.dataset.overdueId) {
          const overdueID = parseInt(taskElement.dataset.overdueId);
          deleteOverdueTask(overdueID);
          deleteOverdueTaskElement(overdueID);

          toggleShowTodaySections();
        }

        taskElement.style.maxHeight = `${taskElement.offsetHeight}px`;
        taskElement.classList.add("disappearing");
        setTimeout(() => {
          taskElement.remove();
        }, 285);
      })();

      const updateSectionTasksIndixes = (() => {
        tasksElements.forEach((task) => {
          if (task.dataset.taskIndex > taskIndex) {
            task.dataset.taskIndex -= 1;
          }
        });
      })();

      updateProjectTasksNumber();
    } else if (deleteProjectCommentMode) {
      const commentsContainerWrapper = document.querySelector(
        ".comments-container-wrapper"
      );
      const commentIndex = +deleteModal.dataset.commentIndex;
      toDoProjects.projects[projectIndex].comments.splice(commentIndex, 1);
      const commentsNumber =
        toDoProjects.projects[projectIndex].comments.length;
      const comment = document.querySelector(
        `.comment[data-index="${commentIndex}"]`
      );

      const commentsNumberElement = document.querySelector(".comments-number");
      comment.style.maxHeight = `${comment.offsetHeight}px`;

      comment.classList.add("disappearing");
      setTimeout(() => {
        comment.remove();
        if (commentsNumber === 0) {
          const commentsContainer = document.querySelector(
            ".comments-container"
          );
          commentsContainer.classList.add("appear-empty-state", "empty");
          setTimeout(() => {
            commentsContainer.classList.remove("appear-empty-state");
          }, 201);
        }
      }, 285);

      const projectCommentsNumberElement = document.querySelector(
        `[data-project='${projectIndex}'] .project-comments-content`
      );

      if (commentsNumber === 0) {
        commentsNumberElement.textContent = "";
        projectCommentsNumberElement.textContent = "Comments";
      } else {
        projectCommentsNumberElement.textContent = commentsNumber;
        commentsNumberElement.textContent = commentsNumber;
      }

      const comments = document.querySelectorAll(".comment");
      comments.forEach((comment) => {
        if (comment.dataset.index > commentIndex) {
          comment.dataset.index -= 1;
        }
      });
    } else if (deleteSectionMode && sectionIndex !== 0) {
      const sectionIndex = parseInt(deleteModal.dataset.section);
      toDoProjects.projects[projectIndex].sections.splice(sectionIndex, 1);

      const sectionTodayTasks = document.querySelectorAll(
        `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] [data-today-id]`
      );

      const sectionOverdueTasks = document.querySelectorAll(
        `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] [data-overdue-id]`
      );

      const sectionElements = document.querySelectorAll(
        `[data-project="${projectIndex}"][data-section="${sectionIndex}"], 
       [data-project="${projectIndex}"] [data-section="${sectionIndex}"]`
      );

      sectionTodayTasks.forEach((task) => {
        const todayID = parseInt(task.dataset.todayId);
        deleteTodayTask(todayID);
        updateTodayTasksElementsIndixes(todayID, false);
      });

      sectionOverdueTasks.forEach((task) => {
        const overdueID = parseInt(task.overdueId);
        deleteOverdueTask(overdueID);
        updateOverdueTasksElementsIndixes(overdueID, false);
      });

      sectionElements.forEach((sectionElement) => {
        if (!sectionElement.matches(".delete-modal")) {
          sectionElement.remove();
        }
      });

      const projectSectionDropdownElements = document.querySelectorAll(
        `[data-project="${projectIndex}"][data-section], [data-project="${projectIndex}"] [data-section]`
      );
      projectSectionDropdownElements.forEach(
        (projectSectionDropdownElement) => {
          if (
            parseInt(projectSectionDropdownElement.dataset.section) >
            sectionIndex
          ) {
            projectSectionDropdownElement.dataset.section -= 1;
          }
        }
      );
      updateProjectTasksNumber();
    }

    makeAddTasksButtonsAppear();

    deleteModal.removeAttribute("data-project");
    deleteModal.removeAttribute("data-section");
    deleteModal.removeAttribute("data-task-index");
    deleteModal.removeAttribute("data-comment-index");

    saveToDoProjects();
    updateProjectTasksNumber("today");
  });
})();
