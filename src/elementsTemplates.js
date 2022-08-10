import { format } from 'date-fns';
import { toDoProjects } from './logic';

const { DateTime } = require('luxon');

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

  if (dueDate === '') {
    dueDateStatusClass = 'disabled';
  } else {
    dueDateStatusClass = 'active';
  }

  const now = DateTime.local();
  const localTimeZone = now.zoneName;

  if (dueDate) {
    if (dueDate.startOf('day').ts === now.startOf('day').ts) {
      dueDateClass = 'today';
      dueDateContent = 'Today';
    } else if (dueDate.year === now.year) {
      dueDateClass = 'date';
      dueDateContent = format(dueDate.toJSDate(), 'LLL d');
    } else {
      dueDateClass = 'date';
      dueDateContent = format(dueDate.toJSDate(), 'LLL d uuuu');
    }

    if (dueDate < now) {
      dueDateClass = 'overdue';
    }

    if (dueDateTimeZone && dueDateTimeZone !== localTimeZone) {
      timeZoneStatusClass = 'active';
    } else {
      timeZoneStatusClass = 'disabled';
    }
  } else {
    dueDateClass = 'unset';
    dueDateContent = '';
    timeZoneStatusClass = 'disabled';
  }

  let completedStatus;

  if (status === false) {
    completedStatus = '';
  } else {
    completedStatus = ' completed';
  }

  let todayAttributes;
  let datasetToday = '';
  let selectedProjectSection;
  let projectItemIconContent;

  const previousTodayTaskElement = document.querySelector([
    `.task-item[data-today-id="${todayID}"]:not([data-project])`,
  ]);
  const previousOverdueTaskElement = document.querySelector([
    `.task-item[data-overdue-id="${overdueID}"]:not([data-project])`,
  ]);

  if (todayID !== '') {
    if (previousTodayTaskElement && dueDate > now) {
      dueDateStatusClass = 'disabled';
    }
  } else {
    selectedProjectSection = '';
    todayAttributes = '';
  }

  if (previousTodayTaskElement || previousOverdueTaskElement) {
    const taskItem = document.querySelector([
      `.task-item[data-today-id="${todayID}"]:not([data-project]`,
    ])
      || document.querySelector([
        `.task-item[data-overdue-id="${overdueID}"]:not([data-project])`,
      ]);
    const sectionIndex = taskItem.closest('[data-section]').dataset.section;
    const projectIndex = parseInt(
      taskItem.closest('[data-project]').dataset.project,
    );
    const projectTitle = taskItem
      .closest('[data-project]')
      .querySelector('.project-item-title').textContent;
    let circleColor;
    let sectionTitle;
    if (sectionIndex == 0) {
      sectionTitle = '';
    } else {
      sectionTitle = taskItem
        .closest('[data-section]')
        .querySelector('.section-title').textContent;
      sectionTitle = `/ ${sectionTitle}`;
    }

    if (projectIndex === 0) {
      projectItemIconContent = '<svg width="18" height="18" viewBox="0 0 24 24"><g fill="#246fe0" fill-rule="nonzero"><path d="M10 14.5a2 2 0 104 0h5.5V18a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18v-3.5H10z" opacity="0.1"></path><path d="M8.062 4h7.876a2 2 0 011.94 1.515l2.062 8.246a2 2 0 01.06.485V18a2 2 0 01-2 2H6a2 2 0 01-2-2v-3.754a2 2 0 01.06-.485l2.06-8.246A2 2 0 018.061 4zm0 1a1 1 0 00-.97.757L5.03 14.004a1 1 0 00-.03.242V18a1 1 0 001 1h12a1 1 0 001-1v-3.754a1 1 0 00-.03-.242l-2.06-8.247A1 1 0 0015.94 5H8.061zM12 17.25A2.75 2.75 0 019.295 15H7a.5.5 0 110-1h2.75a.5.5 0 01.5.5 1.75 1.75 0 003.5 0 .5.5 0 01.5-.5H17a.5.5 0 110 1h-2.295A2.75 2.75 0 0112 17.25z"></path></g></svg>';
    } else {
      circleColor = toDoProjects.projects[projectIndex].color;
      projectItemIconContent = `<span class="circle ${circleColor}"></span>`;
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
    selectedProjectSection = '';
    todayAttributes = '';
  }

  if (todayID !== '') {
    datasetToday = ` data-today-id="${todayID}"`;
  }

  if (overdueID !== '') {
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

export function createSectionTemplate(index, title, expandStatus = 'active') {
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
  projectCommentsNumber = 0,
) {
  let projectCommentsContent;

  if (projectCommentsNumber === 0) {
    projectCommentsContent = 'Comments';
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
                      <svg id="empty-state-illustration" viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="1.5"><g transform="translate(-2800 -240)"><g id="ProjectNew"><path fill="none" d="M1800-100h300v300h-300z" transform="matrix(.73333 0 0 .66667 1480 306.667)"></path><path d="M19249.7 1267h-50v60.8l50 9.74V1267z" fill="#f9e4e2" stroke="#f9e4e2" stroke-width="3.2" transform="matrix(.07647 0 -.2183 -.8732 1784.795 1497.148)"></path><path d="M19249.7 1267h-50v82.69" fill="#fff" stroke="#f9e4e2" stroke-width="2.24" stroke-linejoin="miter" transform="matrix(1.13552 0 -.21699 .86796 -18612.74 -811.212)"></path><path d="M19200.3 1283.96c-6.3.23-7.9.54-8.3 1.4v64.61c.6 1.17 14.7.95 15.5-.55v-64.61c-.5-.8-1.3-.93-7.2-.85zM19250.3 1265.88c-6.3.23-7.9.53-8.3 1.4v66.62c.6 1.16 14.7.95 15.5-.55v-66.62c-.5-.8-1.3-.93-7.2-.85z" fill="#f9e4e2" fill-rule="nonzero" transform="matrix(-.1332 0 -.22039 .88155 5812.674 -832.598)"></path><path fill="#f9e4e2" d="M19199.7 1267h50v82.695h-50z" transform="matrix(-1.33455 0 .01261 -.05045 28582.064 352.417)"></path><path d="M19199.8 1369.29c-.6-3.68-.8-9.2-.8-24.4v-82.7c0-12.86.1-14.08.5-15.01h50c.8 1.52 1 15.99 1 24.63v82.69c0 12.86-.1 14.09-.6 15.02h-50c0-.08-.1-.15-.1-.23zm49.2-39.42v-43.05h-48.5v43.05h48.5z" fill="#f9e4e2" fill-rule="nonzero" transform="matrix(-1.33455 0 .01261 -.05045 28582.064 352.417)"></path><path fill="#f9e4e2" stroke="#f9e4e2" stroke-width="6.66" d="M19199.7 1267h50v82.695h-50z" transform="matrix(-.07647 0 .10594 -.42378 4277.86 824.587)"></path><path fill="#f9e4e2" stroke="#f9e4e2" stroke-width="6.56" d="M19199.7 1267h50v82.695h-50z" transform="matrix(-.07647 0 .10754 -.43017 4269.21 935.737)"></path><path d="M16552.5 1390h52.7" fill="#fff" transform="matrix(.42129 0 0 .42129 -4046.398 -194.795)"></path><path d="M16605.4 1387.64c4.6.64 2 4.63-.2 4.73h-52.7c-4.5-.21-2.6-4.62 0-4.74 17.6 0 35.3-.81 52.9.01z" fill="#f9e4e2" fill-rule="nonzero" transform="matrix(.42129 0 0 .42129 -4046.398 -194.795)"></path><path d="M16552.5 1390h95" fill="#fff" transform="matrix(.42129 0 0 .42129 -4010.738 -194.795)"></path><path d="M16647.8 1387.64c4.4.84 1.9 4.6-.3 4.73h-95c-2.5-.15-3.6-4.52 0-4.74h95c.1 0 .2.01.3.01z" fill="#f9e4e2" fill-rule="nonzero" transform="matrix(.42129 0 0 .42129 -4010.738 -194.795)"></path><path d="M16003 624.294c-7.6 8.064-9.1 23.123-3.8 32.949" fill="none" stroke="#eca19a" stroke-width="1.94" transform="matrix(1.14978 0 0 .89148 -15565.633 -208.494)"></path><path d="M19262.4 1267h-62.7v82.69h66.8l-4.1-82.69z" fill="#f9e4e2" transform="matrix(-.85107 0 .01261 -.05045 19281.444 421.147)"></path><path d="M19199.9 1369.32c-.8-2.41-1.3-9.25-1.4-24.43v-82.7c.1-12.86.2-14.08.9-15.01h62.7c.7.84.9 4.13 1.2 9.84l4.1 82.7c.6 13.19.3 28.66-.6 29.8h-66.8c0-.07-.1-.13-.1-.2zm64.3-39.45l-2.1-43.05h-61.2v43.05h63.3z" fill="#f9e4e2" fill-rule="nonzero" transform="matrix(-.85107 0 .01261 -.05045 19281.444 421.147)"></path><path d="M19245.2 1314.42c1.8 1.05 14.9.67 15.4-.73l-6.3-52.75c-.7-1.13-14.8-1.14-15.5.59l6.3 52.74c0 .05.1.1.1.15z" fill="#eca19a" fill-rule="nonzero" transform="matrix(.03447 .12866 .90855 -.01528 1104.478 -2103.974)"></path><path d="M19246.3 1323.23c1.8 1 14.8.64 15.3-.75l-7.3-61.54c-.7-1.15-14.9-.84-15.5.59l7.3 61.54c.1.05.1.1.2.16z" fill="#eca19a" fill-rule="nonzero" transform="matrix(.03447 .12866 .90855 -.01528 1094.671 -2168.354)"></path><path d="M19265.2 1097.4c1.4-2.57 2.2-5.57 3.5-8.18" fill="none" stroke="#eca19a" stroke-width="2" transform="matrix(.95795 0 0 1.03606 -15481.433 -868.863)"></path><path d="M19286.3 1102.52c1.1.08 1.3 1.47.1 1.96-2.2.95-3.9 3.03-6.3 3.56-.1.03-.3.04-.4.02-.1-.02-.3-.07-.4-.13-.7-.41-.5-1.42.4-1.82 2.3-.95 3.9-3.04 6.3-3.56.1-.02.1-.03.3-.03zM19277.7 1127.04c.5.05 1.1.36 1.6.57 2.7.95 6.1 1.67 6.5 2.64.4.91-.6 1.5-2.7.75-2.7-.95-6.2-1.7-6.5-2.71-.2-.61.2-1.28 1.1-1.25z" fill="#eca19a" fill-rule="nonzero" transform="matrix(.95795 0 0 1.03606 -15481.433 -868.863)"></path><path d="M19167.2 1070.73c-.6 3.88-.9 7.8-1.3 11.7M19159.8 1076.51c4.4-.23 8.8-.55 13.2-.5" fill="none" stroke="#f9e4e2" stroke-width="3.54" transform="matrix(.56424 0 0 .56423 -7914.567 -339.462)"></path><path d="M19167.3 1068.96c3.2.22 1 8.15.4 13.67-.4 2.21-3.8 2.26-3.3-2.58.5-4.78 0-11.14 2.9-11.09z" fill="#f9e4e2" fill-rule="nonzero" transform="matrix(.56424 0 0 .56423 -7824.656 -277.755)"></path><path d="M19172.6 1074.23c2.3.02 3.3 3.52-1.2 3.55-4.8.05-11.1 1.33-12.6.14-1.4-1.04-.6-3.09 2.6-3.27 3.7-.21 7.4-.43 11.2-.42z" fill="#f9e4e2" fill-rule="nonzero" transform="matrix(.56424 0 0 .56423 -7824.656 -277.755)"></path><path d="M19167.2 1070.73c-.6 3.88-.9 7.8-1.3 11.7M19159.8 1076.51c4.4-.23 8.8-.55 13.2-.5" fill="none" stroke="#f9e4e2" stroke-width="3.54" transform="matrix(.56424 0 0 .56423 -7994.157 -297.504)"></path><g transform="translate(-14492.231 -834.45) scale(.90071)"><path d="M19276.9 1295l-2.9 11.86-7.4 3.34s-27.7 6.81-33.5 51.1h21.7l6.3-19.44 4.2 18.98 41.9 1.29-23-67.13h-7.3z" fill="#eca19a"></path><clipPath id="_clip1"><path d="M19276.9 1295l-2.9 11.86-7.4 3.34s-27.7 6.81-33.5 51.1h21.7l6.3-19.44 4.2 18.98 41.9 1.29-23-67.13h-7.3z"></path></clipPath></g><path d="M19295.2 1306.61c-.2-.47-.1-.98.2-1.38.3-.41.7-.65 1.2-.64 3.7.02 10.8.07 10.8.07 10.9 17.48 28.7 27.88 28.3 44.64-.4 18.31-18 18-18 18s-18.5-49.92-22.5-60.69z" fill="#eca19a" transform="matrix(.85845 0 0 .85845 -13676.33 -776.881)"></path><g transform="matrix(0 -.85845 .85845 0 1711.975 16981.555)"><path d="M19291.7 1372.3c-.1 10.6-8.8 12.98-7.7 24.55.9 8.77 9 17.03 20.7 17.45 19.5.7 27.6-13.14 27-26-.3-7.76-3-14.23-6.5-19.41v7.49c0 3.9-2.5 7.34-6.3 8.43 2.3-3.87 2-9.12 2-9.12-1.6 2.67-5.6 7.9-10.9 9.4-1.7.49-4.8-.31-5.8-2.46-1.1-2.29-.9-5.51 1.1-7.58 4.8-5 7.6-9.54 7.2-16.74-8-2.64-20.6-1.96-20.8 13.99z" fill="#f9e4e2"></path><clipPath id="_clip2"><path d="M19291.7 1372.3c-.1 10.6-8.8 12.98-7.7 24.55.9 8.77 9 17.03 20.7 17.45 19.5.7 27.6-13.14 27-26-.3-7.76-3-14.23-6.5-19.41v7.49c0 3.9-2.5 7.34-6.3 8.43 2.3-3.87 2-9.12 2-9.12-1.6 2.67-5.6 7.9-10.9 9.4-1.7.49-4.8-.31-5.8-2.46-1.1-2.29-.9-5.51 1.1-7.58 4.8-5 7.6-9.54 7.2-16.74-8-2.64-20.6-1.96-20.8 13.99z"></path></clipPath><g clip-path="url(#_clip2)"><path d="M16099.6 679.265c2.4 0 4.2 2.639 4.2 4.985 0 2.346-1.9 4.25-4.2 4.25-2.4 0-4.3-1.904-4.3-4.25s2-4.985 4.3-4.985z" fill="#eca19a" transform="matrix(-.28842 .97029 -.92651 -.2754 24572.3 -14047.1)"></path><path d="M16099.6 679.265c2.4 0 4.2 2.639 4.2 4.985 0 2.346-1.9 4.25-4.2 4.25-2.4 0-4.3-1.904-4.3-4.25s2-4.985 4.3-4.985z" fill="#fff" transform="matrix(-.28842 .97029 -.92651 -.2754 24599.2 -14038.7)"></path><path d="M16099.6 679.265c2.4 0 4.2 2.639 4.2 4.985 0 2.346-1.9 4.25-4.2 4.25-2.4 0-4.3-1.904-4.3-4.25s2-4.985 4.3-4.985z" fill="#fff" transform="matrix(-.32435 1.09119 -1.04196 -.30972 25246.8 -15951)"></path></g><path d="M19291.7 1372.3c-.1 10.6-8.8 12.98-7.7 24.55.9 8.77 9 17.03 20.7 17.45 19.5.7 27.6-13.14 27-26-.3-7.76-3-14.23-6.5-19.41v7.49c0 3.9-2.5 7.34-6.3 8.43 0 0 0 0 0 0 2.3-3.87 2-9.12 2-9.12-1.6 2.67-5.6 7.9-10.9 9.4-1.7.49-4.8-.31-5.8-2.46-1.1-2.29-.9-5.51 1.1-7.58 4.8-5 7.6-9.54 7.2-16.74-8-2.64-20.6-1.96-20.8 13.99z" fill="none" stroke="#f9e4e2" stroke-width="2.33"></path></g><path d="M16107.3 700.521c-1.2-.843-2.8-.789-3.9.132-.3.161-.6.347-.6.347-3.4 3.002-.9 9.41 3.1 8.522 3.2-.702 4.9-5.184 2.6-7.863-.3-.454-.7-.83-1.2-1.138z" fill="#da4c3f" transform="matrix(.97753 -.51297 .51297 .97753 -13190.728 7988.74)"></path><path d="M19470.3 1352.95h52.7s7.1.23 12.4.41c3.5.12 6.6 2.35 7.8 5.65.3.95.6 1.65.6 1.65" fill="none" stroke="#eca19a" stroke-width="2.12" transform="translate(-15499.133 -882.078) scale(.9415)"></path><path d="M16068.8 683.026c6.5 1.439 12.1 7.636 13.9 11.287" fill="none" stroke="#e57f78" stroke-width="2.22" transform="matrix(.89465 0 0 .9083 -11491.324 -220.686)"></path><path d="M16068.7 683.395c6.5 1.439 12.1 7.636 13.8 11.287" fill="none" stroke="#e57f78" stroke-width="1.88" transform="matrix(.95306 0 0 1.1624 -12427.227 -397.535)"></path><path d="M16068.9 683.279c6.5 1.439 12.1 7.636 13.8 11.287" fill="none" stroke="#e57f78" stroke-width="2.07" transform="matrix(.85407 0 0 1.06841 -10833.823 -335.455)"></path><path d="M19274.4 1304.12c-3.6.35-8.1 1.92-11.6 3.5-5.1 2.4-18.9 9.99-25.4 25.53-6.8 15.95-9.5 33.38-5.7 42.15 3.3 7.32 13 6.68 19 5.5 4.4-.86 25.8-7.04 34.9-6.79 4.1.11 9.2 1.35 16 8.5" fill="none" stroke="#e57f78" stroke-width="2.33" transform="matrix(.86182 0 0 .8537 -13741.13 -770.678)"></path><path d="M16058.9 653.508c-.4 5.37-2 10.503-5.9 14.712" fill="none" stroke="#fff" stroke-width="1.92" transform="matrix(1.1425 0 0 .9299 -15464.433 -236.626)"></path><path d="M19538.1 1258.3c2 8.28-.1 14.71-4.9 19.81" fill="none" stroke="#eca19a" stroke-width="2.66" transform="matrix(.7015 0 0 .80046 -10814.023 -694.515)"></path><path d="M19529.2 1271.24c-3.3 3.35-3.7 6.53-.7 12.37 1.5 2.95 3.2 7.03 5.6 12.69" fill="none" stroke="#eca19a" stroke-width="2.4" transform="matrix(.83438 0 0 .83438 -13410.529 -737.193)"></path><path d="M19160.4 1277.9c.2 6.19-4.2 11.55-10.3 12.49-.7.1-1.2.48-1.5 1.03-.3.56-.4 1.22-.1 1.81 1.6 3.71 6 7.85 12.6 5.02 7-2.99 4.9-15.42-.7-20.78v.43z" fill="#eca19a" transform="matrix(1.49043 .00256 -.00256 1.49043 -25673.656 -1657.511)"></path><path d="M16022.3 611.33l36.8-31.33" fill="none" stroke="#da4c3f" stroke-width="4.62" transform="matrix(.52844 0 0 .31016 -5585.881 133.434)"></path><path d="M16107.3 535s-8.5 11.9-8.5 17c0 3.863 3.9 7 8.5 7 4.7 0 8.5-3.137 8.5-7 0-5.1-8.5-17-8.5-17z" fill="#da4c3f" transform="matrix(.1581 .47606 -.57807 .19198 679.295 -7463.167)"></path><path d="M19504.3 1271.6c-5 16.25-26 20.96-37.3 31.4-12 11.16-16.1 29.79-4.5 42.37" fill="none" stroke="#eca19a" stroke-width="2.4" transform="matrix(.83438 0 0 .83438 -13416.929 -747.808)"></path><path d="M19520.3 1259.31s-.4 1.41-.1 2.67" fill="none" stroke="#da4c3f" stroke-width="2.3" transform="matrix(.83438 .06975 0 .83438 -13411.429 -2098.014)"></path><path d="M19519.9 1259.48s0 1.24.3 2.5" fill="none" stroke="#da4c3f" stroke-width="2.4" transform="matrix(.82411 .13052 -.13052 .8241 -13036.928 -3274.295)"></path><path d="M19145 1118.21c3.3 1.78 1.2 4.03 1.2 10.1 0 6.07 2.2 10-1.2 11.9-3.9 2.15-7.3-4.92-7.3-10.99s3.9-12.87 7.3-11.01z" fill="#da4c3f" transform="matrix(1.2025 .78234 -.78234 1.2025 -19277.242 -16032.061)"></path><path d="M19139.2 1117.24c2.6 1.58 5.1 3.31 7.2 5.55" fill="none" stroke="#da4c3f" stroke-width="2.76" stroke-linejoin="miter" transform="matrix(.69429 -.15995 .16558 .71874 -10624.623 2555.238)"></path><path d="M19538 1284c4 6.06 7.7 12.23 11.9 18.18" fill="none" stroke="#eca19a" stroke-width="2.4" transform="translate(-13410.829 -737.216) scale(.83438)"></path><path d="M19523.9 1259.19c.4 3.27 1.5 4.98 4.7 6.38l-4.5 2.39" fill="none" stroke="#da4c3f" stroke-width="2.4" transform="translate(-13409.429 -738.51) scale(.83438)"></path><path d="M19504.3 1258.42c6.1-4.33 10.8-9.66 13.3-16.92" fill="none" stroke="#eca19a" stroke-width="2.4" transform="translate(-13409.029 -736.584) scale(.83438)"></path></g></g></svg>
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
  tasksNumber = '',
) {
  return `
    <li class="project-item sidebar-item" data-project='${index}'>
    <div class="project">
        <span class="circle-container">
            <span class="circle ${color}"></span>
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

  title = toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[taskIndex]
    .title;
  description = toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[taskIndex]
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
                                                  
                                                </div>
                                                <div class="arrow"></div>   
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
                                                    
                                                  </div>
                                                  <div class="arrow"></div>   
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
  date = format(new Date(date), 'MMMM dd KK:mm a');
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
  sectionIndex,
) {
  let projectItemIconContent;
  let circleColor;
  let projectSectionTitle = toDoProjects.projects[projectIndex].title;

  if (projectIndex === 0 && sectionIndex === 0) {
    projectItemIconContent = '<svg width="24" height="24" viewBox="0 0 24 24"><g fill="#246fe0" fill-rule="nonzero"><path d="M10 14.5a2 2 0 104 0h5.5V18a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18v-3.5H10z" opacity="0.1"></path><path d="M8.062 4h7.876a2 2 0 011.94 1.515l2.062 8.246a2 2 0 01.06.485V18a2 2 0 01-2 2H6a2 2 0 01-2-2v-3.754a2 2 0 01.06-.485l2.06-8.246A2 2 0 018.061 4zm0 1a1 1 0 00-.97.757L5.03 14.004a1 1 0 00-.03.242V18a1 1 0 001 1h12a1 1 0 001-1v-3.754a1 1 0 00-.03-.242l-2.06-8.247A1 1 0 0015.94 5H8.061zM12 17.25A2.75 2.75 0 019.295 15H7a.5.5 0 110-1h2.75a.5.5 0 01.5.5 1.75 1.75 0 003.5 0 .5.5 0 01.5-.5H17a.5.5 0 110 1h-2.295A2.75 2.75 0 0112 17.25z"></path></g></svg>';
  } else if (projectIndex && sectionIndex === 0) {
    circleColor = toDoProjects.projects[projectIndex].color;
    projectItemIconContent = `
            <span class="circle ${circleColor}"></span>
            `;
  } else {
    projectItemIconContent = '<svg data-svgs-path="sm1/section.svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#808080" fill-rule="nonzero" d="M17.5 20c.276 0 .5.224.5.5s-.224.5-.5.5h-11c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h11zM16 8c1.105 0 2 .895 2 2v5c0 1.105-.895 2-2 2H8c-1.105 0-2-.895-2-2v-5c0-1.105.895-2 2-2h8zm0 1H8c-.513 0-.936.386-.993.883L7 10v5c0 .513.386.936.883.993L8 16h8c.513 0 .936-.386.993-.883L17 15v-5c0-.513-.386-.936-.883-.993L16 9zm1.5-5c.276 0 .5.224.5.5s-.224.5-.5.5h-11c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h11z"></path></svg>';

    projectSectionTitle = toDoProjects.projects[projectIndex].sections[sectionIndex].title;
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
  const date = dueDateTimeZone === now.zoneName
    ? format(task.dueDate.toJSDate(), 'EEE LLL d')
    : format(task.dueDate.toJSDate(), 'EEE LLL d h:mm aa');
  let whenIsDateContent = '';
  const datesDifference = Math.abs(
    dueDate.startOf('day').diff(now.startOf('day'), ['days']).toObject().days,
  );
  const tasksDueNumberContent = tasksDueNumber === 0
    ? 'No tasks due'
    : tasksDueNumber > 1
      ? `${tasksDueNumber} tasks due`
      : `${tasksDueNumber} task due`;

  if (dueDate.startOf('day') > now.startOf('day')) {
    whenIsDateContent = datesDifference > 1
      ? `${datesDifference} days left`
      : `${datesDifference} day left`;
  } else if (dueDate.startOf('day') < now.startOf('day')) {
    whenIsDateContent = datesDifference > 1
      ? `${datesDifference} days ago`
      : `${datesDifference} day ago`;
  }

  let dateTimezone = '';
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

export const createElementFromTemplate = (template) => document.createRange().createContextualFragment(template);
