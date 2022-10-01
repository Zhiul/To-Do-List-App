import { format } from "date-fns";
import { toDoProjects } from "./logic";

const { DateTime } = require("luxon");

export function createTaskTemplate(task, index, status = false) {
  const { title } = task;
  const { description } = task;
  const { dueDate } = task;
  const { priority } = task;
  const { todayID } = task;
  const { overdueID } = task;
  const { dueDateTimeZone } = task;

  let dueDateStatusClass;
  let dueDateClass;
  let dueDateContent;
  let timeZoneStatusClass;

  if (dueDate === "") {
    dueDateStatusClass = "disabled";
  } else {
    dueDateStatusClass = "active";
  }

  const now = DateTime.local();
  const localTimeZone = now.zoneName;

  if (dueDate) {
    if (dueDate.startOf("day").ts === now.startOf("day").ts) {
      dueDateClass = "today";
      dueDateContent = "Today";
    } else if (dueDate.year === now.year) {
      dueDateClass = "date";
      dueDateContent = format(dueDate.toJSDate(), "LLL d");
    } else {
      dueDateClass = "date";
      dueDateContent = format(dueDate.toJSDate(), "LLL d uuuu");
    }

    if (dueDate < now) {
      dueDateClass = "overdue";
    }

    if (dueDateTimeZone && dueDateTimeZone !== localTimeZone) {
      timeZoneStatusClass = "active";
    } else {
      timeZoneStatusClass = "disabled";
    }
  } else {
    dueDateClass = "unset";
    dueDateContent = "";
    timeZoneStatusClass = "disabled";
  }

  let completedStatus;

  if (status === false) {
    completedStatus = "";
  } else {
    completedStatus = " completed";
  }

  let todayAttributes;
  let datasetToday = "";
  let selectedProjectSection;
  let projectItemIconContent;

  const previousTodayTaskElement = document.querySelector([
    `.task-item[data-today-id="${todayID}"]:not([data-project])`,
  ]);
  const previousOverdueTaskElement = document.querySelector([
    `.task-item[data-overdue-id="${overdueID}"]:not([data-project])`,
  ]);

  if (todayID !== "") {
    if (previousTodayTaskElement && dueDate > now) {
      dueDateStatusClass = "disabled";
    }
  } else {
    selectedProjectSection = "";
    todayAttributes = "";
  }

  if (previousTodayTaskElement || previousOverdueTaskElement) {
    const taskItem =
      document.querySelector([
        `.task-item[data-today-id="${todayID}"]:not([data-project]`,
      ]) ||
      document.querySelector([
        `.task-item[data-overdue-id="${overdueID}"]:not([data-project])`,
      ]);
    const sectionIndex = taskItem.closest("[data-section]").dataset.section;
    const projectIndex = parseInt(
      taskItem.closest("[data-project]").dataset.project
    );
    const projectTitle = taskItem
      .closest("[data-project]")
      .querySelector(".project-item-title").textContent;
    let circleColor;
    let sectionTitle;
    if (sectionIndex == 0) {
      sectionTitle = "";
    } else {
      sectionTitle = taskItem
        .closest("[data-section]")
        .querySelector(".section-title").textContent;
      sectionTitle = `/ ${sectionTitle}`;
    }

    if (projectIndex === 0) {
      projectItemIconContent =
        '<svg width="18" height="18" viewBox="0 0 24 24"><g fill="#246fe0" fill-rule="nonzero"><path d="M10 14.5a2 2 0 104 0h5.5V18a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18v-3.5H10z" opacity="0.1"></path><path d="M8.062 4h7.876a2 2 0 011.94 1.515l2.062 8.246a2 2 0 01.06.485V18a2 2 0 01-2 2H6a2 2 0 01-2-2v-3.754a2 2 0 01.06-.485l2.06-8.246A2 2 0 018.061 4zm0 1a1 1 0 00-.97.757L5.03 14.004a1 1 0 00-.03.242V18a1 1 0 001 1h12a1 1 0 001-1v-3.754a1 1 0 00-.03-.242l-2.06-8.247A1 1 0 0015.94 5H8.061zM12 17.25A2.75 2.75 0 019.295 15H7a.5.5 0 110-1h2.75a.5.5 0 01.5.5 1.75 1.75 0 003.5 0 .5.5 0 01.5-.5H17a.5.5 0 110 1h-2.295A2.75 2.75 0 0112 17.25z"></path></g></svg>';
    } else {
      circleColor = toDoProjects.projects[projectIndex].color;
      projectItemIconContent = `<span class="circle" data-color="${circleColor}"></span>`;
    }
    todayAttributes = ` data-project='${projectIndex}' data-section='${sectionIndex}'`;
    selectedProjectSection = `
            <span class="selected-project-section-link">                                    
            <span class="project-item-content">
            <span class="project-item-title">${projectTitle}</span>
            <span class="project-item-section-title">${sectionTitle}</span>
            </span>
            <span class="project-item-icon">
            ${projectItemIconContent}
            </span>
            </span>`;
  } else {
    selectedProjectSection = "";
    todayAttributes = "";
  }

  if (todayID !== "") {
    datasetToday = ` data-today-id="${todayID}"`;
  }

  if (overdueID !== "") {
    datasetToday = ` data-overdue-id="${overdueID}"`;
  }

  return `
      <li class="task-item${completedStatus}" data-task-index="${index}"${datasetToday}${todayAttributes}>
      <div class="task" role="button">
          
          <div class="task-top">
              <div class="task-checkbox" data-priority="${priority}">
                  <svg width="24" height="24"><path fill="#808080" d="M11.23 13.7l-2.15-2a.55.55 0 0 0-.74-.01l.03-.03a.46.46 0 0 0 0 .68L11.24 15l5.4-5.01a.45.45 0 0 0 0-.68l.02.03a.55.55 0 0 0-.73 0l-4.7 4.35z"></path></svg>
              </div>
              <div class="task-title">${title}</div>
          </div> 
  
          <div class="task-description">${description}</div>
  
          <div class="task-info-tags">
              <button class="task-duedate-button ${dueDateStatusClass} ${dueDateClass}">
                  <span class="task-duedate">
                      <svg width="12" height="12" viewBox="0 0 12 12" class="calendar_icon"><path fill="currentColor" fill-rule="nonzero" d="M9.5 1A1.5 1.5 0 0 1 11 2.5v7A1.5 1.5 0 0 1 9.5 11h-7A1.5 1.5 0 0 1 1 9.5v-7A1.5 1.5 0 0 1 2.5 1h7zm0 1h-7a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5zM8 7.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zM8.5 4a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h5z"></path></svg>
                      <span class="task-duedate-content">${dueDateContent}</span>
                      <span class="timezone ${timeZoneStatusClass}">
                      <svg width="24" height="24" viewBox="0 0 24 24" style="/* width: 21px; *//* height: 21px; */"><path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm7 8.7v.3c0 .1 0 .3-.1.4 0 .1-.1.3-.1.4 0 .1 0 .2-.1.3 0 .1-.1.3-.1.4 0 .1 0 .1-.1.2-.1.2-.1.3-.2.5 0 0 0 .1-.1.1-.1.2-.2.3-.3.5v.1c-.1.2-.2.3-.3.5-.1.2-.3.3-.4.5-.2-.7-.9-1.2-1.7-1.2h-.9v-2.6c0-.5-.4-.9-.9-.9H8.5v-1.8h1.8c.5 0 .9-.4.9-.9V7.6H13c1 0 1.8-.8 1.8-1.8v-.3c.3.1.6.3.9.5.6.3 1.1.8 1.6 1.3.4.5.8 1 1.1 1.6 0 0 0 .1.1.1.3.6.5 1.2.6 1.8v.2c0 .3.1.6.1 1 0-.3 0-.6-.1-1 0 .3.1.6.1 1-.2.2-.2.5-.2.7zm0 0v.2c-.1 0 0-.1 0-.2zm-.1.7c0 .1 0 .2-.1.3 0-.1 0-.2.1-.3zm-.2.6c0 .1-.1.2-.1.3 0-.1.1-.2.1-.3zm-.2.6c0 .1-.1.2-.1.3 0-.1 0-.2.1-.3zm-.3.6c-.1.1-.1.2-.2.3.1-.1.1-.2.2-.3zm-.3.6c-.1.1-.1.2-.2.3 0-.1.1-.2.2-.3zm-.4.5c-.1.1-.1.2-.2.3 0-.1.1-.2.2-.3zM14.7 5.5c.3.1.6.3.8.4-.3-.1-.6-.3-.8-.4zM18.3 9c.1.3.2.5.3.8 0-.2-.1-.5-.3-.8zm.4.9c.1.3.2.6.2.9-.1-.3-.1-.6-.2-.9zm-1-1.9c-.2-.2-.3-.5-.5-.7.2.2.4.5.5.7zm.5.8c-.1-.3-.3-.5-.5-.8.3.3.4.6.5.8zm-1.1-1.6c-.2-.2-.4-.4-.7-.6.2.2.5.4.7.6zM15.6 6c.2.1.5.3.7.5-.2-.2-.4-.3-.7-.5zM5 11.2v.8c0-.5.1-1.1.2-1.6l4.2 4.2v.9c0 1 .8 1.8 1.8 1.8V19c-1-.1-2-.5-2.9-1 0 0-.1 0-.1-.1-.1-.1-.2-.2-.3-.2-.1 0-.1-.1-.2-.1-.1-.1-.2-.2-.3-.2l-.2-.2c-.1-.2-.2-.3-.3-.4-.1-.1-.1-.2-.2-.2-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.1-.3 0-.1-.1-.2-.1-.3 0-.1-.1-.2-.1-.3 0-.1-.1-.2-.1-.3 0-.1-.1-.2-.1-.4 0-.1 0-.2-.1-.3 0-.1 0-.3-.1-.4V11.2zm.2-.7c0 .2-.1.3-.1.5 0-.2 0-.3.1-.5zm5.6 8.4h-.3.3zm-.7-.2c-.1 0-.2 0-.2-.1.1.1.2.1.2.1zm-.7-.2c-.1 0-.2-.1-.3-.1.1 0 .2 0 .3.1zm-.7-.3c-.1 0-.2-.1-.3-.2.1.1.2.1.3.2zm-.6-.4c-.1-.1-.2-.1-.3-.2.2.1.3.2.3.2zm-.5-.3c-.1-.1-.2-.1-.2-.2.1 0 .1.1.2.2zm-.9-.9c-.1-.1-.1-.2-.2-.2.1 0 .1.1.2.2zm-.4-.6c-.1-.1-.1-.2-.2-.2.1.1.1.2.2.2zm-.4-.5c0-.1-.1-.2-.1-.3 0 .1.1.2.1.3zm-.3-.6c0-.1-.1-.2-.1-.3.1.1.1.2.1.3zm-.2-.6c0-.1-.1-.2-.1-.3 0 .1.1.2.1.3zm-.2-.7c0-.1 0-.2-.1-.2.1 0 .1.1.1.2zm-.1-.7v-.2c-.1.1 0 .1 0 .2zm1.8 3.9l.2.2-.2-.2z" fill="currentColor"></path></svg>
                  </span>
                  </span>
              </button>
  
              ${selectedProjectSection}
          </div>
      
      <div class="task-buttons">
  
          <button type="button" class="edit-task-button">
          <svg width="24" height="24"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M9.5 19h10a.5.5 0 110 1h-10a.5.5 0 110-1z"></path><path stroke="currentColor" d="M4.42 16.03a1.5 1.5 0 00-.43.9l-.22 2.02a.5.5 0 00.55.55l2.02-.21a1.5 1.5 0 00.9-.44L18.7 7.4a1.5 1.5 0 000-2.12l-.7-.7a1.5 1.5 0 00-2.13 0L4.42 16.02z"></path></g></svg>
          </button>
  
          <button type="button" class="delete-task" data-modal-target=".delete-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><rect width="14" height="1" x="5" y="6" fill="currentColor" rx=".5"></rect><path fill="currentColor" d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"></path><path stroke="currentColor" d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z"></path></g></svg>
          </button>
      </div>
  </li>
      `;
}

export function createSectionTemplate(index, title, expandStatus = "active") {
  return `
<section data-section='${index}'>
    <div class="section-top">
        <div class="section-title">${title}</div>

        <button type="button" class="delete-section" data-modal-target=".delete-modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><rect width="14" height="1" x="5" y="6" fill="currentColor" rx=".5"></rect><path fill="currentColor" d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"></path><path stroke="currentColor" d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z"></path></g></svg>
        </button>

        <div class="section-expand ${expandStatus}" role="button">
            <svg width="16px" height="16px" viewBox="0 0 16 16"><g transform="translate(-266, -17)" fill="currentColor"><path d="M280,22.7581818 L279.1564,22 L273.9922,26.506 L273.4414,26.0254545 L273.4444,26.0281818 L268.8562,22.0245455 L268,22.7712727 C269.2678,23.878 272.8084,26.9674545 273.9922,28 C274.8718,27.2330909 274.0144,27.9809091 280,22.7581818"></path></g></svg>
        </div>
    </div>
    
    <div class="section-content ${expandStatus}">

        <ul class="tasks-items"></ul>

        <div class="add-task-container">
            <button class="add-task">
                <span class="add-icon">
                    <svg width="13" height="13"><path d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z" fill="#dd4b39" fill-rule="evenodd"></path></svg>
                </span>
                <span class="add-task-text">Add task</span>
            </button>
        </div>
    
    <ul class="completed-tasks-items">
                    
    </ul>
    </div>

    <form class="add-section-container" autocomplete="off">
        <button class="add-section-hover" type="button">
        Add Section
        </button>
    </form>

    </section>`;
}

export function createProjectTemplate(
  projectTitle,
  index,
  projectCommentsNumber = 0
) {
  let projectCommentsContent;

  if (projectCommentsNumber === 0) {
    projectCommentsContent = "Comments";
  } else {
    projectCommentsContent = projectCommentsNumber;
  }

  return `
  <div class="main-content" data-project='${index}'>
  <div class="main-header">
      <span class='main-title project-item-title'>${projectTitle}</span>
      <div class="inbox-header-icons main-icons">
  
          <button class="project-comments" data-modal-target=".project-comments-modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" data-svgs-path="sm1/comments.svg"><path fill="#808080" fill-rule="nonzero" d="M11.707 20.793A1 1 0 0 1 10 20.086V18H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4.5l-2.793 2.793zM11 20.086L14.086 17H19a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h6v3.086z"></path></svg>
          <span class="project-comments-content">${projectCommentsContent}</span>
          </button>
  
              <div class="project-options-dropdown">
  
              <button class="project-options">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="currentColor" stroke="currentcolor" stroke-linecap="round" transform="translate(3 10)"><circle cx="2" cy="2" r="2"></circle><circle cx="9" cy="2" r="2"></circle><circle cx="16" cy="2" r="2"></circle></g></svg>
              </button>
              
              <div class="project-options-dropdown-content dropdown">
                  <ul>
                      <li class="project-option edit-project" data-modal-target=".edit-project-modal">
                          <div class="project-option-icon">
                              <svg width="24" height="24"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M9.5 19h10a.5.5 0 110 1h-10a.5.5 0 110-1z"></path><path stroke="currentColor" d="M4.42 16.03a1.5 1.5 0 00-.43.9l-.22 2.02a.5.5 0 00.55.55l2.02-.21a1.5 1.5 0 00.9-.44L18.7 7.4a1.5 1.5 0 000-2.12l-.7-.7a1.5 1.5 0 00-2.13 0L4.42 16.02z"></path></g></svg>
                          </div>
                          <div class="project-option-content">Edit Project</div>
                      </li>
  
                      <li class="project-option toggle-completed-tasks">
                          <div class="show-completed-tasks show">
                              <div class="project-option-icon">
                                  <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-1a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.9-11.4a.5.5 0 0 1 .7.8l-6 6a.5.5 0 0 1-.7 0l-2.5-2.5a.5.5 0 0 1 .7-.8l2.1 2.2L16 8.6z"></path></svg>
                              </div>
                              <div class="project-option-content">Show completed tasks</div>
                          </div>
  
                          <div class="hide-completed-tasks">
                              <div class="hide-completed-tasks">
                                  <div class="project-option-icon">
                                      <svg width="24" height="24"><path fill="currentColor" fill-rule="nonzero" d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 1a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm3.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"></path></svg>
                                  </div>
                                  <div class="project-option-content">Hide completed tasks</div>
                              </div>
                          </div>
                      </li>
  
                      <li class="project-option delete-project" data-modal-target=".delete-modal">
                          <div class="project-option-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><rect width="14" height="1" x="5" y="6" fill="currentColor" rx=".5"></rect><path fill="currentColor" d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"></path><path stroke="currentColor" d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z"></path></g></svg>
                          </div>
                          <div class="project-option-content">Delete Project</div>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  </div>
  
  <div class="main-to-do-list">
  <section data-section='0'>
      <div class="section-content active">
          <ul class="tasks-items"></ul>
  
          <div class="add-task-container">
              <button class="add-task">
                  <span class="add-icon">
                      <svg width="13" height="13"><path d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z" fill="#dd4b39" fill-rule="evenodd"></path></svg>
                  </span>
                  <span class="add-task-text">Add task</span>
              </button>
          </div>
  
          <ul class="completed-tasks-items">
                      
          </ul> 
        </div>
  
          <form class="add-section-container" autocomplete="off">
              <button class="add-section-hover" type="button">
              Add Section
              </button>
          </form>
      
  </section>
  
  <div class="empty-state active">
                      <div class="empty-state-content">
                      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <g class="ldl-scale" style="transform-origin: 142% 50%; transform: rotate(0deg) scale(0.8, 0.8); animation-play-state: paused;" transform="matrix(1.085782, 0, 0, 0.759845, -11767.899414, 10319.396484)">
    <path d="M -4.922 39.266 C -4.922 39.266 85.193 107.648 222.188 -20.216 C 343.852 -133.77 443.195 45.393 443.89 131.192 C 444.792 242.336 322.226 331.264 381.705 404.264 C 441.189 477.263 263.747 597.811 168.115 493.485 C 49.154 363.708 16.925 469.153 -50.884 469.153 C -99.551 469.153 -199.469 348.229 -131.995 258.266 C -75.219 182.559 -106.185 157.437 -121.179 131.192 C -142.81 93.339 -91.439 -9.4 -4.922 39.266 Z" fill="var(--lightestColor)" style=""></path>
    <path d="M 75.237 308.687 C 66.416 305.877 56.767 308.422 50.48 315.216 C 44.037 322.282 42.645 331.489 45.335 339.364 C 46.614 343.106 46.372 347.151 44.309 350.522 L 43.973 351.085 C 41.569 355.247 40.482 359.629 40.658 363.356 C 40.926 369.062 39.785 374.746 36.602 379.491 L 36.268 379.992 C 32.847 385.187 28.807 390.02 26.233 395.7 C 23.616 401.356 21.288 407.178 20.179 413.708 L 20.904 414.124 C 26.001 409.9 29.881 404.973 33.47 399.874 C 37.103 394.805 39.27 388.889 42.058 383.331 L 42.326 382.784 C 44.846 377.655 49.192 373.825 54.271 371.201 C 57.588 369.493 60.837 366.361 63.24 362.193 L 63.516 361.702 C 65.423 358.237 68.78 355.92 72.659 355.163 C 79.479 353.849 85.389 349.637 88.856 343.62 C 96.529 330.301 89.902 313.299 75.237 308.687 Z" style="animation-play-state: paused; fill: var(--mainColor);"></path>
    <path d="M 195.672 234.343 L 142.581 317.83 L 146.184 319.907 L 177.386 343.989 L 203.495 306.57 C 206.233 300.785 207.066 294.28 205.87 287.993 L 195.672 234.343 Z" style="animation-play-state: paused; fill: var(--darkestColor);"></path>
    <path d="M 22.035 201.809 L 2.68 243.13 L 39.136 258.107 L 43.921 260.869 L 90.615 171.726 L 36.935 190.465 C 30.89 192.572 25.675 196.544 22.035 201.809 Z" style="animation-play-state: paused; fill: var(--darkestColor);"></path>
    <path d="M 133.444 267.841 L 90.601 243.106 L 42.018 304.481 L 104.583 340.604 L 133.444 267.841 Z" fill="#666" style="fill: var(--darkestColor); animation-play-state: paused;"></path>
    <path d="M 252.641 62.682 C 253.182 50.064 245.156 38.665 233.093 34.922 C 225.02 32.385 216.199 34.049 209.057 38.591 L 154.029 73.601 C 148.645 77.036 143.944 81.44 140.165 86.59 L 245.477 147.39 C 248.032 141.554 249.518 135.289 249.791 128.89 L 252.641 62.682 Z" style="animation-play-state: paused; fill: var(--darkestColor);"></path>
    <path d="M 137.001 91.376 L 90.615 171.726 L 43.921 260.869 L 142.581 317.83 L 195.672 234.343 L 242.913 152.523 C 243.87 150.863 244.711 149.14 245.477 147.39 L 140.165 86.59 C 139.032 88.124 137.962 89.712 137.001 91.376 Z" style="animation-play-state: paused; fill: var(--lightColor);"></path>
    <circle r="26.367" cy="37.939" cx="57.535" transform="matrix(0.5, -0.866025, 0.866025, 0.5, 99.771136, 200.816203)" style="animation-play-state: paused; fill: var(--lightestColor);"></circle>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
    <g transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)" style=""></g>
  </g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
  <g transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)" style=""></g>
</svg>
                      <div class="empty-state-header">What will you accomplish?
                      </div>
                      </div>
                  </div>
  </div>
  </div>
  `;
}

export function createProjectSidebarTemplate(
  index,
  color,
  title,
  tasksNumber = ""
) {
  return `
    <li class="project-item sidebar-item" data-project='${index}'>
    <div class="project">
        <span class="circle-container">
            <span class="circle" data-color="${color}"></span>
        </span>
        <div class="project-item-title">${title}</div>
        <span class="item-number">${tasksNumber}</span>
    </div>

    <div class="sidebar-project-options-dropdown">
                                <button type="button" class="sidebar-project-options">
                                    <svg class="project-options-icon" width="15" height="3"><path d="M1.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="#808080" fill-rule="evenodd"></path></svg>
                                </button>
                            </div>
    
    </li>
    `;
}

export function editTaskBoxTemplate(projectIndex, sectionIndex, taskIndex) {
  let title;
  let description;

  title =
    toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[taskIndex]
      .title;
  description =
    toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[taskIndex]
      .description;

  return `
      <form class="edit-task-box-container task-box-c" data-project="${projectIndex}" data-section="${sectionIndex}" data-task-index="${taskIndex}" autocomplete="off">
                              <div class="edit-task-box task-box">
                                  <div class="task-inputs">
                                  <textarea name="task-title" rows="1" cols="30" class="task-input task-title" placeholder="Task name" maxlength="500">${title}</textarea>
                                  
                                  <textarea name="edit-task-description" cols="30" class="textarea-task-description task-input" placeholder='Description' maxlength='16384'>${description}</textarea>
                                  </div>
                                
                                  <div class="task-fields">
                                      <div class="left-task-fields">
                                          <div class="schedule-duedate">
                                              <div class="duedate-selector">
                                                  <div class="calendar-icon">
                                                      <svg data-svgs-path="sm1/calendar_small.svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="nonzero" d="M12 2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8zm0 1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1.25 7a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm.75-5a.5.5 0 1 1 0 1h-7a.5.5 0 0 1 0-1h7z"></path></svg>
                                                      
                                                  </div>
                                                  <div class="selected-duedate">Schedule</div>
                                                  <input type="text" class="schedule-input" autocomplete="off">
                                              </div>
                                          </div>
  
                                          <div class="select-project-section">
                                              <button type='button' class="selected-project-section" data-project="0" data-section="0">
                                                  <span class="project-item-icon"></span>
                                                  <span class="project-item-content">
                                                  <span class="project-item-title"></span>
                                                  <span class="project-item-section-title"></span>
                                                  </span>
                                              </button>
                              
                                              <div class="select-project-section-dropdown-content dropdown">
                                                  <ul>
                                                      
                                                  </ul>
                                                  <div class="arrow"></div> 
                                                </div>
      
                                          </div> 
                                      </div>
  
                                      <div class="select-priority-dropdown">
                                          <button type='button' class="selected-priority" data-priority='4'>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="nonzero" d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"></path></svg>
                                          </button>
                                          <div class="select-priority-dropdown-content dropdown">
                                              <span class="priority-item" data-priority="1">
                                                  <span class="priority-item-info">
                                                      <span class="priority-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#d1453b" fill-rule="nonzero" d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"></path></svg></span>
                                  
                                                      <span class="Priority-title">Priority 1</span>
                                                  </span>
                                  
                                  
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="20" height="20"><path fill="transparent" fill-rule="evenodd" d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"></path></svg>
                                              </span>
                                  
                                              <span class="priority-item" data-priority="2">
                                                  <span class="priority-item-info">
                                                      <span class="priority-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#eb8909" fill-rule="nonzero" d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"></path></svg></span>
                                  
                                                      <span class="Priority-title">Priority 2</span>
                                                  </span>
                                  
                                  
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="20" height="20"><path fill="transparent" fill-rule="evenodd" d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"></path></svg>
                                              </span>
                                  
                                              <span class="priority-item" data-priority="3">
                                                  <span class="priority-item-info">
                                                      <span class="priority-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#246fe0" fill-rule="nonzero" d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"></path></svg></span>
                                  
                                                      <span class="Priority-title">Priority 3</span>
                                                  </span>
                                  
                                  
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="20" height="20"><path fill="transparent" fill-rule="evenodd" d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"></path></svg>
                                              </span>
                                  
                                              <span class="priority-item selected" data-priority="4">
                                                  <span class="priority-item-info">
                                                      <span class="priority-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgb(192, 192, 192)" fill-rule="nonzero" d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"></path></svg></span>
                                  
                                                      <span class="Priority-title">Priority 4</span>
                                                  </span>
                                  
                                  
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="20" height="20"><path fill="transparent" fill-rule="evenodd" d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"></path></svg>
                                              </span>
                                      </div>
                                  
                                      <div class="dropdown-overlay"></div>
                                  </div>
                                  
                                  </div>
                                  </div>
                                  
                                  <div class="edit-task-box-buttons">
                                      <button type='button' class="edit-task action-todo">Edit task</button>
                                      <button type='button' class="cancel-task">Cancel</button>
                                  </div>
                          </form>
      `;
}

export const addTaskBoxTemplate = `
<form class="add-task-box-container task-box-c" autocomplete="off">
                                <div class="add-task-box task-box">
                                    <div class="task-inputs">
                                    <textarea name="task-title" rows="1" cols="30" class="task-input task-title" placeholder="Task name" maxlength="500"></textarea>
                                    
                                    <textarea name="add-task-description" cols="30" class="add-task-description task-input textarea-task-description" placeholder='Description' maxlength='16384'></textarea>
                                    </div>
                            
                                    <div class="task-fields">
                                        <div class="left-task-fields">
                                            <div class="schedule-duedate">
                                                <div class="duedate-selector">
                                                    <div class="calendar-icon">
                                                        <svg data-svgs-path="sm1/calendar_small.svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="nonzero" d="M12 2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8zm0 1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1.25 7a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm.75-5a.5.5 0 1 1 0 1h-7a.5.5 0 0 1 0-1h7z"></path></svg>
                                                        
                                                    </div>
                                                    <div class="selected-duedate">Schedule</div>
                                                    <input type="text" class="schedule-input" autocomplete="off">
                                                </div>
                                            </div>
    
                                            <div class="select-project-section">
                                                <button type='button' class="selected-project-section" data-project="0" data-section="0">
                                                    <span class="project-item-icon"></span>
                                                    <span class="project-item-content">
                                                    <span class="project-item-title"></span>
                                                    <span class="project-item-section-title"></span>
                                                    </span>
                                                </button>
                                
                                                <div class="select-project-section-dropdown-content dropdown">
                                                    <ul>
                                                        
                                                    </ul>
                                                    <div class="arrow"></div>  
                                                  </div>
                                              
                                            </div> 
                                        </div>

                                        <div class="select-priority-dropdown">
                                            <button type='button' class="selected-priority" data-priority='4'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="nonzero" d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"></path></svg>
                                            </button>
                                            <div class="select-priority-dropdown-content dropdown">
                                                <span class="priority-item" data-priority="1">
                                                    <span class="priority-item-info">
                                                        <span class="priority-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#d1453b" fill-rule="nonzero" d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"></path></svg></span>
                                    
                                                        <span class="Priority-title">Priority 1</span>
                                                    </span>
                                    
                                    
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="20" height="20"><path fill="transparent" fill-rule="evenodd" d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"></path></svg>
                                                </span>
                                    
                                                <span class="priority-item" data-priority="2">
                                                    <span class="priority-item-info">
                                                        <span class="priority-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#eb8909" fill-rule="nonzero" d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"></path></svg></span>
                                    
                                                        <span class="Priority-title">Priority 2</span>
                                                    </span>
                                    
                                    
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="20" height="20"><path fill="transparent" fill-rule="evenodd" d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"></path></svg>
                                                </span>
                                    
                                                <span class="priority-item" data-priority="3">
                                                    <span class="priority-item-info">
                                                        <span class="priority-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#246fe0" fill-rule="nonzero" d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"></path></svg></span>
                                    
                                                        <span class="Priority-title">Priority 3</span>
                                                    </span>
                                    
                                    
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="20" height="20"><path fill="transparent" fill-rule="evenodd" d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"></path></svg>
                                                </span>
                                    
                                                <span class="priority-item selected" data-priority="4">
                                                    <span class="priority-item-info">
                                                        <span class="priority-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgb(192, 192, 192)" fill-rule="nonzero" d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"></path></svg></span>
                                    
                                                        <span class="Priority-title">Priority 4</span>
                                                    </span>
                                    
                                    
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="20" height="20"><path fill="transparent" fill-rule="evenodd" d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"></path></svg>
                                                </span>
                                        </div>
                                    
                                        <div class="dropdown-overlay"></div>
                                    </div>
                                    
                                    </div>
                                    </div>
                                    
                                    <div class="add-task-box-buttons">
                                        <button type='button' class="add-todo action-todo">Add task</button>
                                        <button type='button' class="cancel-task">Cancel</button>
                                    </div>
                            </form>
                        </div>
`;

export function createCommentTemplate(content, date, index) {
  date = format(new Date(date), "MMMM dd KK:mm a");
  return `<div class="comment" data-index="${index}">
      <img src="./assets/user-icon.png" alt="user-icon" class="user-icon">
      <div class="comment-content">
          <div class="comment-header">
              <span class="user-name">User</span>
              <span class="time">${date}</span>
              <div class="comment-actions">
                  <button type="button" class="edit-comment">
                      <svg width="24" height="24" aria-hidden="true"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M9.5 19h10a.5.5 0 110 1h-10a.5.5 0 110-1z"></path><path stroke="currentColor" d="M4.42 16.03a1.5 1.5 0 00-.43.9l-.22 2.02a.5.5 0 00.55.55l2.02-.21a1.5 1.5 0 00.9-.44L18.7 7.4a1.5 1.5 0 000-2.12l-.7-.7a1.5 1.5 0 00-2.13 0L4.42 16.02z"></path></g></svg>
                  </button>
                  <button type="button" class="delete-comment" data-modal-target=".delete-modal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><rect width="14" height="1" x="5" y="6" fill="currentColor" rx=".5"></rect><path fill="currentColor" d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"></path><path stroke="currentColor" d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z"></path></g></svg>
                  </button>
              </div>
          </div>
          <p class="comment-description">${content}</p>
      </div>
  </div>`;
}

export function createProjectSectionDropdownElementTemplate(
  projectIndex,
  sectionIndex
) {
  let projectItemIconContent;
  let circleColor;
  let projectSectionTitle = toDoProjects.projects[projectIndex].title;

  if (projectIndex === 0 && sectionIndex === 0) {
    projectItemIconContent =
      '<svg width="24" height="24" viewBox="0 0 24 24"><g fill="#246fe0" fill-rule="nonzero"><path d="M10 14.5a2 2 0 104 0h5.5V18a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18v-3.5H10z" opacity="0.1"></path><path d="M8.062 4h7.876a2 2 0 011.94 1.515l2.062 8.246a2 2 0 01.06.485V18a2 2 0 01-2 2H6a2 2 0 01-2-2v-3.754a2 2 0 01.06-.485l2.06-8.246A2 2 0 018.061 4zm0 1a1 1 0 00-.97.757L5.03 14.004a1 1 0 00-.03.242V18a1 1 0 001 1h12a1 1 0 001-1v-3.754a1 1 0 00-.03-.242l-2.06-8.247A1 1 0 0015.94 5H8.061zM12 17.25A2.75 2.75 0 019.295 15H7a.5.5 0 110-1h2.75a.5.5 0 01.5.5 1.75 1.75 0 003.5 0 .5.5 0 01.5-.5H17a.5.5 0 110 1h-2.295A2.75 2.75 0 0112 17.25z"></path></g></svg>';
  } else if (projectIndex && sectionIndex === 0) {
    circleColor = toDoProjects.projects[projectIndex].color;
    projectItemIconContent = `
            <span class="circle" data-color="${circleColor}"></span>
            `;
  } else {
    projectItemIconContent =
      '<svg data-svgs-path="sm1/section.svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#808080" fill-rule="nonzero" d="M17.5 20c.276 0 .5.224.5.5s-.224.5-.5.5h-11c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h11zM16 8c1.105 0 2 .895 2 2v5c0 1.105-.895 2-2 2H8c-1.105 0-2-.895-2-2v-5c0-1.105.895-2 2-2h8zm0 1H8c-.513 0-.936.386-.993.883L7 10v5c0 .513.386.936.883.993L8 16h8c.513 0 .936-.386.993-.883L17 15v-5c0-.513-.386-.936-.883-.993L16 9zm1.5-5c.276 0 .5.224.5.5s-.224.5-.5.5h-11c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h11z"></path></svg>';

    projectSectionTitle =
      toDoProjects.projects[projectIndex].sections[sectionIndex].title;
  }

  return `
          <li class="project-section-item" data-project="${projectIndex}" data-section="${sectionIndex}">
              <span class="project-item-icon">
              ${projectItemIconContent}
              </span>
              <span class="project-item-title">${projectSectionTitle}</span>
          </li>
        `;
}

export function dueDateToolTipTemplate(task, tasksDueNumber) {
  const now = DateTime.local();
  const { dueDateTimeZone } = task;
  const { dueDate } = task;
  const date =
    dueDateTimeZone === now.zoneName
      ? format(task.dueDate.toJSDate(), "EEE LLL d")
      : format(task.dueDate.toJSDate(), "EEE LLL d h:mm aa");
  let whenIsDateContent = "";
  const datesDifference = Math.abs(
    dueDate.startOf("day").diff(now.startOf("day"), ["days"]).toObject().days
  );
  const tasksDueNumberContent =
    tasksDueNumber === 0
      ? "No tasks due"
      : tasksDueNumber > 1
      ? `${tasksDueNumber} tasks due`
      : `${tasksDueNumber} task due`;

  if (dueDate.startOf("day") > now.startOf("day")) {
    whenIsDateContent =
      datesDifference > 1
        ? `${datesDifference} days left`
        : `${datesDifference} day left`;
  } else if (dueDate.startOf("day") < now.startOf("day")) {
    whenIsDateContent =
      datesDifference > 1
        ? `${datesDifference} days ago`
        : `${datesDifference} day ago`;
  }

  let dateTimezone = "";
  if (task.dueDateTimeZone !== now.zoneName) {
    dateTimezone = `Timezone: ${task.dueDateTimeZone}`;
  }

  return `
    <div class="duedate-tooltip">
      <span class="date">${date}</span>
      <span class="when-is-date">${whenIsDateContent}</span>
      <hr class="duedate-tooltip-separator">
      <span class="date-timezone">${dateTimezone}</span>
      <span class="tasks-due-number">${tasksDueNumberContent}</span>
    </div>
   `;
}

export function createEditCommentContainerTemplate(comment) {
  return `
      <div class="edit-comment-container">
      <div class="edit-comment-input-wrapper">
          <textarea class="edit-comment-box" cols="30" placeholder="Write a comment" maxlength='15000'>${comment}</textarea>
          <span class="comment-character-limit"></span>
      </div>
  
      <div class="edit-comment-buttons">
          <button class="update-comment">Update</button>
          <button class="cancel-edit-comment">Cancel</button>
      </div>
      </div>
      `;
}

export const addSectionBoxTemplate = `
  <div class="add-section-box">
  <input type="text" name="section-name" class="section-title" placeholder="Name this section" maxlength="300" autocomplete="off">

  <div class="add-section-box-buttons">
      <button id="add-section" type="button">Add Section</button>
      <button id="cancel-add-section" type="button">Cancel</button>
  </div>
</div>
  `;

export const editSectionBoxTemplate = `
  <div class="edit-section-box">
  <input type="text" name="section-name" class="section-title" placeholder="Name this section" maxlength="300" autocomplete="off">

  <div class="edit-section-box-buttons">
      <button class="edit-section" type="button">Edit Section</button>
      <button class="cancel-edit-section" type="button">Cancel</button>
  </div>
</div>
  `;

export const createElementFromTemplate = (template) =>
  document.createRange().createContextualFragment(template);
