import { toDoProjects, projectCreate, saveToDoProjects } from './logic';
import {
  createElementFromTemplate,
  createProjectTemplate,
  createSectionTemplate,
  createProjectSidebarTemplate,
  createProjectSectionDropdownElementTemplate,
  addSectionBoxTemplate,
  editSectionBoxTemplate,
} from './elementsTemplates';
import { closeModals } from './modals';
import {
  main,
  saveTaskBoxTask,
  enableElementScroll,
  disableElementScroll,
  toggleEmptyState,
} from './utilities';
import { isMobile } from './mobile';

const editProjectForm = document.querySelector('.edit-project-form');
const editProjectNameInput = editProjectForm.querySelector('.project-name');
const editProjectColorButton = editProjectForm.querySelector('.project-color');
const editProjectButton = document.querySelector('#edit-project-button');

editProjectButton.addEventListener('click', editProject);

function editProject() {
  const projectIndex = parseInt(editProjectForm.dataset.project);

  function editProject() {
    toDoProjects.projects[projectIndex].title = editProjectNameInput.value;

    const validColors = [
      'berry-red',
      'red',
      'orange',
      'yellow',
      'olive-green',
      'lime-green',
      'green',
      'mint-green',
      'teal',
      'sky-blue',
      'light-blue',
      'blue',
      'grape',
      'violet',
      'lavender',
      'magenta',
      'salmon',
      'charcoal',
      'gray',
      'taupe',
    ];

    let { color } = editProjectColorButton.dataset;

    if (validColors.includes(color) === false) {
      color = 'charcoal';
    }

    toDoProjects.projects[projectIndex].color = color;

    saveToDoProjects();
  }

  function editProjectElement(projectIndex) {
    const projectTitle = toDoProjects.projects[projectIndex].title;
    const projectTitles = document.querySelectorAll(
      `.main-content[data-project="${projectIndex}"] .main-title, [data-project="${projectIndex}"] .project-item-title`,
    );
    projectTitles.forEach((title) => {
      title.textContent = projectTitle;
    });

    const projectCircleColor = toDoProjects.projects[projectIndex].color;
    const projectCirclesElements = document.querySelectorAll(
      `[data-project="${projectIndex}"]:not(.edit-project-form) .circle`,
    );

    projectCirclesElements.forEach((projectCircle) => {
      projectCircle.classList.value = `circle ${projectCircleColor}`;
    });
  }

  editProject();
  editProjectElement(projectIndex);

  closeModals();
}

document.addEventListener('click', (event) => {
  if (event.target.matches('.project-option.edit-project')) {
    const editProjectButton = event.target;
    let projectIndex;

    const editProjectTitleInput = document.querySelector(
      '.edit-project-modal .project-name',
    );
    editProjectTitleInput.focus();

    if (document.querySelector('.project-item.active')) {
      const projectItem = document.querySelector('.project-item.active');
      projectIndex = parseInt(projectItem.dataset.project);
    } else {
      projectIndex = parseInt(
        document.querySelector('.main-content.enabled').dataset.project,
      );
    }

    if (projectIndex !== 0) {
      editProjectForm.dataset.project = projectIndex;

      const initializeEditProjectModal = (() => {
        const projectTitle = toDoProjects.projects[projectIndex].title;
        editProjectNameInput.value = projectTitle;
        checkProjectTitleCharacterLimit.call(editProjectNameInput);
        enableProjectButtonAction.call(editProjectNameInput);

        const projectColor = toDoProjects.projects[projectIndex].color;
        const editProjectColorDropdown = editProjectForm.querySelector(
          '.project-color-dropdown-content',
        );
        const projectColorItem = editProjectColorDropdown
          .querySelector(`.${projectColor}`)
          .closest('.project-color-item');
        projectColorItem.click();
      })();
    }
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('.project-section-item')) {
    event.preventDefault();
    const projectSectionDropdownElement = event.target;
    const selectProjectSectionDropdownElementContainer = projectSectionDropdownElement.closest('.select-project-section');
    const projectIndex = parseInt(
      projectSectionDropdownElement.dataset.project,
    );
    const sectionIndex = parseInt(
      projectSectionDropdownElement.dataset.section,
    );

    const selectedProjectButton = selectProjectSectionDropdownElementContainer.querySelector(
      '.selected-project-section',
    );
    selectedProjectButton.dataset.project = projectIndex;
    selectedProjectButton.dataset.section = sectionIndex;

    const projectFirstSectionDropdownElement = selectProjectSectionDropdownElementContainer.querySelector(
      `.project-section-item[data-project="${projectIndex}"][data-section="0"]`,
    );

    const projectIconContent = projectFirstSectionDropdownElement.querySelector(
      '.project-item-icon',
    ).innerHTML;
    const selectedProjectButtonIcon = selectedProjectButton.querySelector('.project-item-icon');
    selectedProjectButtonIcon.innerHTML = projectIconContent;

    const changeSelectedProjectSectionTitle = (() => {
      const projectSectionTitle = projectSectionDropdownElement.querySelector(
        '.project-item-title',
      ).textContent;

      const selectedProjectButtonTitle = selectedProjectButton.querySelector(
        '.project-item-title',
      );
      const selectedProjectButtonSectionTitle = selectedProjectButton.querySelector('.project-item-section-title');

      const projectTitle = toDoProjects.projects[projectIndex].title;
      selectedProjectButtonTitle.textContent = projectTitle;

      if (sectionIndex === 0) {
        selectedProjectButtonSectionTitle.textContent = '';
      } else {
        selectedProjectButtonSectionTitle.textContent = ` / ${projectSectionTitle}`;
      }

      selectedProjectButton.classList.add('selected');
      setTimeout(() => {
        selectedProjectButton.classList.remove('selected');
      }, 180);
    })();

    const enableCheckmark = (() => {
      const projectSectionDropdownElements = selectProjectSectionDropdownElementContainer.querySelectorAll(
        '.project-section-item',
      );
      projectSectionDropdownElements.forEach((item) => {
        item.classList.remove('selected');
      });

      projectFirstSectionDropdownElement.classList.add('selected');
      projectSectionDropdownElement.classList.add('selected');
    })();
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('.project-options')) {
    const projectOptionsButton = event.target;
    projectOptionsButton.classList.toggle('active');
    const dropdown = projectOptionsButton.nextElementSibling;
    dropdown.style.willChange = 'transform, opacity';
    dropdown.addEventListener('animationend', () => {
      dropdown.style.willChange = null;
    });

    const toggleDropdown = (() => {
      setTimeout(() => {
        dropdown.classList.toggle('show');
        if (dropdown.classList.contains('show')) {
          disableElementScroll(main);
        } else {
          enableElementScroll(main);
        }
      }, 8);
    })();
  }
});

document.addEventListener('click', (event) => {
  if (!event.target.matches('.project-options')) {
    if (document.querySelector('.project-options-dropdown-content.show')) {
      const projectOptionsButton = document.querySelector(
        '.project-options.active',
      );
      projectOptionsButton.classList.remove('active');
      const dropdown = document.querySelector(
        '.project-options-dropdown-content.show',
      );
      dropdown.classList.toggle('show');
      if (document.querySelector('.dropdown.show') === null) {
        enableElementScroll(main);
      }
    }
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('.toggle-completed-tasks')) {
    const toggleCompletedTasksButton = event.target;
    const sectionsCompletedTasksContainers = document.querySelectorAll(
      '.main-content.enabled .completed-tasks-items',
    );

    if (toggleCompletedTasksButton.classList.contains('hide')) {
      setTimeout(() => {
        toggleCompletedTasksButton.classList.toggle('hide');
      }, 100);

      sectionsCompletedTasksContainers.forEach((container) => {
        container.classList.remove('active');
        container.classList.add('disabled');
        container.style.maxHeight = `${container.scrollHeight}px`;
      });
    } else {
      setTimeout(() => {
        toggleCompletedTasksButton.classList.toggle('hide');
      }, 100);

      sectionsCompletedTasksContainers.forEach((container) => {
        container.classList.remove('disabled');
        container.classList.add('active');
      });
    }
    const projectIndex = document.querySelector('.main-content.enabled').dataset
      .project;
    toggleEmptyState(projectIndex);
  }
});

const changeSidebarProjectOptionsDropdown = new ResizeObserver((entries) => {
  const dropdown = document.querySelector(
    '.sidebar-project-options-dropdown-content.show',
  );

  entries.forEach((entry) => {
    const actualPosition = dropdown.classList.contains('down') ? 'down' : 'top';
    const optimalDropdownPosition = sidebarProjectOptionsDropdown.getOptimalDropdownPosition();

    if (actualPosition !== optimalDropdownPosition) {
      sidebarProjectOptionsDropdown.position(optimalDropdownPosition);
    }
  });
});

const sidebarProjectOptionsDropdown = (() => {
  let projectOptionsButton;
  let dropdown;

  function updateValues() {
    dropdown = document.querySelector(
      '.sidebar-project-options-dropdown-content.show',
    );
    projectOptionsButton = document.querySelector('.project-item.active');
  }

  function getOptimalDropdownPosition() {
    let position;

    const downDropdown = projectOptionsButton.getBoundingClientRect().bottom + 122
      < window.innerHeight
      ? (position = 'down')
      : (position = 'top');

    return position;
  }

  function position(position) {
    if (position === 'down') {
      down();
    } else {
      top();
    }
  }

  function initialize() {
    updateValues();
    const dropdownPosition = getOptimalDropdownPosition();
    position(dropdownPosition);
  }

  function top() {
    dropdown.classList.remove('down');
    dropdown.classList.add('top');
    dropdown.style.animation = 'none';

    dropdown.style.top = `${
      projectOptionsButton.getBoundingClientRect().top - 125
    }px`;
    dropdown.style.animation = null;
  }

  function down() {
    dropdown.classList.remove('top');
    dropdown.classList.add('down');
    dropdown.style.animation = 'none';

    dropdown.style.top = `${
      projectOptionsButton.getBoundingClientRect().bottom - 3
    }px`;
    dropdown.style.animation = null;
  }

  return { initialize, getOptimalDropdownPosition, position };
})();

document.addEventListener('click', (event) => {
  if (event.target.matches('.sidebar-project-options')) {
    const projectOptionsButton = event.target;
    const projectSidebarElement = projectOptionsButton.closest('.project-item');
    const dropdown = document.querySelector(
      '.sidebar-project-options-dropdown-content',
    );

    const projectOptionsButtons = document.querySelectorAll(
      '.sidebar-project-options',
    );
    const sidebarContent = document.querySelector('.sidebar-content');

    const toggleDropdown = (() => {
      const sideBarViewport = document.querySelector('.sidebar .os-viewport');
      const sideBarScrollbar = document.querySelector(
        '.sidebar .os-scrollbar-vertical .os-scrollbar-handle',
      );
      dropdown.classList.toggle('show');

      if (dropdown.classList.contains('show')) {
        projectSidebarElement.classList.toggle('active');
        sidebarProjectOptionsDropdown.initialize();
        changeSidebarProjectOptionsDropdown.observe(
          document.querySelector('body'),
        );
        sideBarScrollbar.classList.add('hide');
        disableElementScroll(sideBarViewport);
        disableElementScroll(main);
        sidebarContent.style.pointerEvents = 'none';
        projectOptionsButtons.forEach((button) => {
          if (button !== projectOptionsButton) {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
          }
        });
      } else {
        changeSidebarProjectOptionsDropdown.disconnect();
        dropdown.classList.remove('down', 'top');
        projectSidebarElement.classList.remove('active');
        sideBarScrollbar.classList.remove('hide');
        enableElementScroll(sideBarViewport);
        enableElementScroll(main);
        sidebarContent.style.pointerEvents = 'auto';
        projectOptionsButtons.forEach((button) => {
          button.style.opacity = null;
          button.style.pointerEvents = 'all';
        });
      }
    })();

    window.onclick = function (event) {
      if (!event.target.matches('.sidebar-project-options')) {
        const sideBarViewport = document.querySelector('.sidebar .os-viewport');
        const sideBarScrollbar = document.querySelector(
          '.sidebar .os-scrollbar-vertical .os-scrollbar-handle',
        );
        if (dropdown.classList.contains('show')) {
          changeSidebarProjectOptionsDropdown.disconnect();
          dropdown.classList.toggle('show');
          dropdown.classList.remove('down', 'top');
          projectSidebarElement.classList.remove('active');
          sidebarContent.style.pointerEvents = 'all';
          projectOptionsButtons.forEach((button) => {
            button.style.opacity = null;
            button.style.pointerEvents = 'all';
          });
          sideBarScrollbar.classList.remove('hide');
          enableElementScroll(sideBarViewport);
          if (document.querySelector('.dropdown.show') === null) {
            enableElementScroll(main);
          }
        }
      }
    };
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('.add-project-above')) {
    const projectIndex = document.querySelector('.project-item.active').dataset
      .project;
    addProjectForm.dataset.project = projectIndex;
    addProjectForm.dataset.position = 'above';
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('.add-project-below')) {
    const projectIndex = document.querySelector('.project-item.active').dataset
      .project;
    addProjectForm.dataset.project = projectIndex;
    addProjectForm.dataset.position = 'below';
  }
});

// Section

document.addEventListener('click', (event) => {
  if (event.target.matches('.add-section-hover')) {
    const addSectionHover = event.target;
    const addSectionHoverButtons = document.querySelectorAll('.add-section-hover');
    const addSectionBox = (() => {
      if (!addSectionHover.classList.contains('disabled')) {
        addSectionHoverButtons.forEach((button) => {
          button.classList.add('disabled');
        });

        const addSectionContainer = addSectionHover.closest(
          '.add-section-container',
        );
        const addSectionBoxElement = createElementFromTemplate(
          addSectionBoxTemplate,
        );
        addSectionContainer.appendChild(addSectionBoxElement);

        const sectionTitleInput = addSectionContainer.querySelector('.section-title');
        sectionTitleInput.addEventListener('input', enableAddSectionButton);
        function enableAddSectionButton() {
          if (!/\S/.test(this.value)) {
            addSectionButton.classList.remove('active');
          } else {
            addSectionButton.classList.add('active');
          }
        }

        const addSectionButton = document.querySelector('#add-section');
        addSectionButton.addEventListener('click', addSection);
        function addSection() {
          if (/\S/.test(sectionTitleInput.value)) {
            const projectElement = document.querySelector(
              '.main-content.enabled',
            );
            const projectIndex = parseInt(projectElement.dataset.project);
            const sectionIndex = parseInt(
              addSectionButton.closest('section').dataset.section,
            );
            const currentSection = addSectionButton.closest('section');
            const newSectionIndex = sectionIndex + 1;
            const sectionTitle = sectionTitleInput.value;

            const addSection = (() => {
              const newSection = projectCreate.newSection(sectionTitle);
              toDoProjects.projects[projectIndex].sections.splice(
                newSectionIndex,
                0,
                newSection,
              );

              saveToDoProjects();
            })();

            const addSectionToTheDOM = (() => {
              const addSectionElement = (() => {
                const sections = projectElement.querySelectorAll('section');
                sections.forEach((section) => {
                  const sectionI = parseInt(section.dataset.section);
                  if (sectionI > sectionIndex) {
                    section.dataset.section = sectionI + 1;
                  }
                });

                const sectionTemplate = createSectionTemplate(
                  newSectionIndex,
                  sectionTitle,
                );

                currentSection.insertAdjacentHTML('afterend', sectionTemplate);

                const sectionCompletedTasksContainer = document.querySelector(
                  `[data-project="${projectIndex}"] [data-section="${newSectionIndex}"] .completed-tasks-items`,
                );
                sectionCompletedTasksContainer.addEventListener(
                  'transitionend',
                  setCompletedTasksContainerFullHeight,
                );
              })();

              const addProjectSectionDropdownElement = (() => {
                const projectSectionDropdownElementTemplate = createProjectSectionDropdownElementTemplate(
                  projectIndex,
                  newSectionIndex,
                );

                const projectSectionDropdownElements = document.querySelectorAll(
                  `.project-section-item[data-project="${projectIndex}"]`,
                );
                projectSectionDropdownElements.forEach(
                  (sectionDropdownElement) => {
                    const sectionI = parseInt(
                      sectionDropdownElement.dataset.section,
                    );
                    if (sectionI > sectionIndex) {
                      sectionDropdownElement.dataset.section = sectionI + 1;
                    }
                  },
                );

                const adjacentSectionDropdownElements = document.querySelectorAll(
                  `.project-section-item[data-project="${projectIndex}"][data-section="${sectionIndex}"]`,
                );
                adjacentSectionDropdownElements.forEach((element) => {
                  element.insertAdjacentHTML(
                    'afterend',
                    projectSectionDropdownElementTemplate,
                  );
                });
              })();
            })();

            addSetSectionsMaxHeightEL();
            removeAddSectionBox();
          }
        }

        const cancelAddSectionButton = document.querySelector(
          '#cancel-add-section',
        );
        cancelAddSectionButton.addEventListener('click', removeAddSectionBox);
        function removeAddSectionBox() {
          const addSectionBox = document.querySelector('.add-section-box');
          addSectionBox.remove();
          addSectionHoverButtons.forEach((button) => {
            button.classList.remove('disabled');
          });
        }
      }
    })();
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('.section-top > .section-title')) {
    const sectionTitle = event.target;

    const editSectionContainer = sectionTitle.closest('.section-top');

    let projectIndex = +sectionTitle.closest('[data-project]').dataset.project;
    let sectionIndex = +sectionTitle.closest('[data-section]').dataset.section;

    const appendEditSectionBox = (() => {
      editSectionContainer.classList.add('edit');
      let editSectionBoxElement = createElementFromTemplate(
        editSectionBoxTemplate,
      );
      editSectionContainer.appendChild(editSectionBoxElement);
      editSectionBoxElement = editSectionContainer.querySelector('.edit-section-box');

      const sectionTitleInput = editSectionBoxElement.querySelector('.section-title');
      sectionTitleInput.value = toDoProjects.projects[projectIndex].sections[sectionIndex].title;
      const editSectionButton = editSectionBoxElement.querySelector('.edit-section');
      sectionTitleInput.addEventListener('input', enableEditSectionButton);

      function enableEditSectionButton() {
        if (!/\S/.test(sectionTitleInput.value)) {
          editSectionButton.classList.remove('active');
        } else {
          editSectionButton.classList.add('active');
        }
      }

      function editSectionTitle() {
        projectIndex = +sectionTitle.closest('[data-project]').dataset.project;
        sectionIndex = +sectionTitle.closest('[data-section]').dataset.section;

        if (/\S/.test(sectionTitleInput.value) && sectionIndex !== 0) {
          const editSectionTitle = (() => {
            toDoProjects.projects[projectIndex].sections[sectionIndex].title = sectionTitleInput.value;

            saveToDoProjects();
          })();

          const editSectionTitleElements = (() => {
            editSectionBoxElement.remove();
            editSectionContainer.classList.remove('edit');
            const sectionTitle = toDoProjects.projects[projectIndex].sections[sectionIndex].title;
            const sectionTitleElements = document.querySelectorAll(
              `[data-project="${projectIndex}"] [data-section="${sectionIndex}"] .section-title, .project-section-item[data-project="${projectIndex}"][data-section="${sectionIndex}"] .project-item-title, .selected-project-section[data-project="${projectIndex}"][data-section="${sectionIndex}"] .project-item-section-title, .task-item[data-project="${projectIndex}"][data-section="${sectionIndex}"] .selected-project-section-link .project-item-section-title`,
            );
            sectionTitleElements.forEach((sectionTitleElement) => {
              if (sectionTitleElement.matches('.project-item-section-title')) {
                sectionTitleElement.textContent = `/ ${sectionTitle}`;
              } else {
                sectionTitleElement.textContent = sectionTitle;
              }
            });
          })();
        }
      }

      editSectionButton.addEventListener('click', editSectionTitle);

      const cancelEditSectionButton = editSectionContainer.querySelector(
        '.cancel-edit-section',
      );

      cancelEditSectionButton.addEventListener('click', removeEditSectionBox);

      function removeEditSectionBox() {
        editSectionContainer.classList.remove('edit');
        editSectionBoxElement.remove();
      }
    })();
  }
});

// Sections Accordions

export function addSetSectionsMaxHeightEL() {
  const sectionsContent = document.querySelectorAll('.section-content');
  sectionsContent.forEach((sectionContent) => {
    const sectionIndex = sectionContent.closest('section').dataset.section;
    if (sectionIndex !== '0' && sectionIndex !== 'overdue') {
      function setFullHeight() {
        const sectionExpandButton = this.closest('section').querySelector('.section-expand');
        if (sectionExpandButton.classList.contains('active') === true) {
          this.style.maxHeight = '100%';
          this.style.overflow = 'visible';
        } else {
          this.style.overflow = 'hidden';
        }
      }
      sectionContent.removeEventListener('transitionend', setFullHeight);
      sectionContent.addEventListener('transitionend', setFullHeight);
    }
  });
}

function setCompletedTasksContainerFullHeight() {
  if (this.classList.contains('disabled')) {
    this.style.maxHeight = `${this.scrollHeight}px`;
  }
}

export function addSetCompletedTasksContainerMaxHeightEL() {
  const completedTasksContainersElements = document.querySelectorAll(
    '.completed-tasks-items',
  );
  completedTasksContainersElements.forEach((completedTaskContainer) => {
    completedTaskContainer.removeEventListener(
      'transitionend',
      setCompletedTasksContainerFullHeight,
    );
    completedTaskContainer.addEventListener(
      'transitionend',
      setCompletedTasksContainerFullHeight,
    );
  });
}

document.addEventListener('click', (event) => {
  if (event.target.matches('.section-expand')) {
    const expandSectionButton = event.target;
    expandSectionButton.classList.toggle('active');

    const projectIndex = parseInt(
      document.querySelector('.main-content.enabled').dataset.project,
    );
    const sectionIndex = parseInt(
      expandSectionButton.closest('section').dataset.section,
    );

    const content = expandSectionButton
      .closest('section')
      .querySelector('.section-content');

    function saveExpandedStatus(status) {
      toDoProjects.projects[projectIndex].sections[sectionIndex].expanded = status;
      saveToDoProjects();
    }

    const toggleSectionAccordion = (() => {
      if (content.classList.contains('active')) {
        content.classList.remove('active');
        content.style.maxHeight = '100%';
      }

      if (content.style.maxHeight) {
        const shrinkAccordion = (() => {
          content.style.opacity = '0';
          content.style.maxHeight = `${content.scrollHeight}px`;

          setTimeout(() => {
            content.style.maxHeight = null;
          }, 121);
          if (content.querySelector('.add-task-box-container')) {
            const removeAddTaskBox = (() => {
              const addTaskBox = document.querySelector(
                '.add-task-box-container:not(.main)',
              );
              if (addTaskBox) {
                addTaskBox.remove();
                const addTaskButtons = document.querySelectorAll('.add-task');
                addTaskButtons.forEach((button) => {
                  button.style.display = 'flex';
                });
              }
            })();
          }
          saveExpandedStatus(false);
        })();
      } else {
        const expandAccordion = (() => {
          content.style.opacity = '1';
          content.style.maxHeight = `${content.scrollHeight}px`;
          saveExpandedStatus(true);
        })();
      }
    })();
  }
});

//

const projectColorDropdownButtons = document.querySelectorAll('.project-color');
projectColorDropdownButtons.forEach((button) => {
  button.addEventListener('click', openProjectColorDropdown, false);
});

function openProjectColorDropdown() {
  this.classList.toggle('active');
  const projectColorDropdown = this.nextElementSibling;

  if (this.classList.contains('active')) {
    projectColorDropdown.classList.replace('active', 'disabled');
  } else if (this.classList.contains('disabled')) {
    projectColorDropdown.classList.replace('disabled', 'active');
  } else {
    projectColorDropdown.classList.add('active');
  }
  projectColorDropdown.classList.remove('hidden');
  projectColorDropdown.classList.toggle('show');
}

document.addEventListener('click', (event) => {
  if (!event.target.matches('.project-color')) {
    if (document.querySelector('.project-color-dropdown-content.show')) {
      const projectColorButton = document.querySelector('.project-color.active');
      const dropdown = document.querySelector(
        '.project-color-dropdown-content.show',
      );
      projectColorButton.classList.remove('active');
      dropdown.classList.remove('show');
      dropdown.classList.add('hidden');
    }
  }
});

const projectColorDropdownItems = document.querySelectorAll(
  '.project-color-item',
);

projectColorDropdownItems.forEach((button) => {
  button.addEventListener('click', () => {
    const colorCircle = button.querySelector('.circle');
    const projectColorDropdownButton = button
      .closest('.project-color-dropdown')
      .querySelector('.project-color');
    const projectColorTitle = button
      .closest('.project-color-dropdown')
      .querySelector('.project-color-name');

    const projectColorDropdownButtonCircle = projectColorDropdownButton.querySelector('.circle');
    projectColorDropdownButtonCircle.classList.value = colorCircle.classList.value;

    const colorName = button.querySelector('.project-color-name-item');
    projectColorTitle.textContent = colorName.textContent;

    projectColorDropdownButton.dataset.color = colorCircle.classList.value.slice(7);

    projectColorDropdownItems.forEach((btn) => {
      if (btn === button) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });

    const projectColorDropdownContainer = document.querySelector(
      '.project-color-dropdown-listbox',
    );

    setTimeout(() => {
      projectColorDropdownContainer.scrollTo(0, 0);
    }, 300);
  });
});

const addProjectModal = document.querySelector('.add-project-modal');
const projectTitleInputs = document.querySelectorAll('.project-name');

function checkProjectTitleCharacterLimit() {
  const charactersLength = this.value.length;
  const characterLimit = this.nextElementSibling;
  if (charactersLength >= 110) {
    characterLimit.textContent = `Character Limit: ${charactersLength}/120`;
  } else {
    characterLimit.textContent = '';
  }
}

function enableProjectButtonAction() {
  const submitProjectButton = this.closest('.modal').querySelector('.submit-project');
  if (!/\S/.test(this.value)) {
    submitProjectButton.classList.remove('active');
  } else {
    submitProjectButton.classList.add('active');
  }
}

projectTitleInputs.forEach((input) => {
  input.addEventListener('input', checkProjectTitleCharacterLimit, false);
});

projectTitleInputs.forEach((input) => {
  input.addEventListener('input', enableProjectButtonAction, false);
});

function updateAddProjectModal(mutationList) {
  mutationList.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const addProjectModal = mutation.target;
      const addProjectForm = addProjectModal.querySelector('.add-project-form');
      const projectTitleInput = addProjectModal.querySelector('.project-name');
      const characterLimit = addProjectModal.querySelector(
        '.project-title-character-limit',
      );

      if (
        addProjectModal.classList.contains('active')
        && addProjectForm.dataset.project
      ) {
        addProjectForm.removeAttribute('data-project');
        addProjectForm.removeAttribute('data-position');
      }

      setTimeout(() => {
        const projectCharcoalColorItem = addProjectModal.querySelector(
          '.project-color-item:nth-of-type(18)',
        );
        projectCharcoalColorItem.click();
        projectTitleInput.value = '';
        characterLimit.textContent = '';
        addProjectButton.classList.remove('active');
      }, 140);
    }
  });
}

const options = {
  attributes: true,
};

const addProjectModalObserver = new MutationObserver(updateAddProjectModal);
addProjectModalObserver.observe(addProjectModal, options);

const addProjectCancelButton = document.querySelector(
  '#add-project-cancel-button',
);
addProjectCancelButton.addEventListener('click', closeModals);

const sidebarAddProjectButton = document.querySelector('#add-project');
const addProjectButton = document.querySelector('#add-project-button');
const addProjectForm = document.querySelector('.add-project-form');
const addProjectTitleInput = document.querySelector('.project-name');

sidebarAddProjectButton.addEventListener('click', () => {
  addProjectTitleInput.focus();
});

addProjectButton.addEventListener('click', addProject);

function addProject() {
  let currentProjectIndex = false;
  let newProjectIndex;
  let projectPosition;

  if (addProjectForm.dataset.project) {
    currentProjectIndex = parseInt(addProjectForm.dataset.project);
    projectPosition = addProjectForm.dataset.position;

    if (projectPosition === 'above') {
      newProjectIndex = currentProjectIndex;
      currentProjectIndex += 1;
    } else if (projectPosition === 'below') {
      newProjectIndex = currentProjectIndex + 1;
    }
  } else {
    newProjectIndex = toDoProjects.projects.length;
  }

  if (addProjectButton.classList.contains('active')) {
    const projectColorDropdownButton = document.querySelector('.project-color');
    const projectTitleInput = document.querySelector('.project-name');
    const title = projectTitleInput.value;

    const validColors = [
      'berry-red',
      'red',
      'orange',
      'yellow',
      'olive-green',
      'lime-green',
      'green',
      'mint-green',
      'teal',
      'sky-blue',
      'light-blue',
      'blue',
      'grape',
      'violet',
      'lavender',
      'magenta',
      'salmon',
      'charcoal',
      'gray',
      'taupe',
    ];

    let { color } = projectColorDropdownButton.dataset;

    if (validColors.includes(color) === false) {
      color = 'charcoal';
    }

    const project = projectCreate.newProject(title, color);
    toDoProjects.projects.splice(newProjectIndex, 0, project);

    saveToDoProjects();

    const updateProjectsElements = (() => {
      if (projectPosition) {
        const projectsElements = document.querySelectorAll('[data-project]');
        projectsElements.forEach((projectElement) => {
          const projectElementValue = parseInt(projectElement.dataset.project);
          if (projectElementValue >= newProjectIndex) {
            projectElement.dataset.project = projectElementValue + 1;
          }
        });
      }
    })();

    (function addProjectElementsToTheDOM() {
      addProjectToTheDOM(
        title,
        newProjectIndex,
        currentProjectIndex,
        projectPosition,
      );
      addProjectToProjectsList(
        newProjectIndex,
        color,
        title,
        currentProjectIndex,
        projectPosition,
      );
      addProjectToSelectSectionDropdowns(
        newProjectIndex,
        currentProjectIndex,
        projectPosition,
      );
    }());

    closeModals();
  }
}

function addProjectToTheDOM(
  title,
  newProjectIndex,
  currentProjectIndex,
  projectPosition,
) {
  const projectTemplate = createProjectTemplate(title, newProjectIndex);
  const projectElement = createElementFromTemplate(projectTemplate);

  if (currentProjectIndex || currentProjectIndex === 0) {
    const currentProject = document.querySelector(
      `.main-content[data-project="${currentProjectIndex}"]`,
    );

    if (projectPosition === 'above') {
      currentProject.insertAdjacentHTML('beforebegin', projectTemplate);
    } else {
      currentProject.insertAdjacentHTML('afterend', projectTemplate);
    }
  } else {
    main.appendChild(projectElement);
  }
}

function addProjectToProjectsList(
  newProjectIndex,
  color,
  title,
  currentProjectIndex,
  projectPosition,
) {
  const projectSidebarTemplate = createProjectSidebarTemplate(
    newProjectIndex,
    color,
    title,
  );
  const projectSidebarElement = createElementFromTemplate(
    projectSidebarTemplate,
  );
  if (currentProjectIndex) {
    const currentProject = document.querySelector(
      `.project-item[data-project="${currentProjectIndex}"]`,
    );

    if (projectPosition === 'above') {
      currentProject.insertAdjacentHTML('beforebegin', projectSidebarTemplate);
    } else {
      currentProject.insertAdjacentHTML('afterend', projectSidebarTemplate);
    }
  } else {
    sidebarProjectsList.appendChild(projectSidebarElement);
  }

  const projectSidebar = document.querySelector(
    `.project-item[data-project="${newProjectIndex}"]`,
  );
  projectSidebar.click();
}

function addProjectToSelectSectionDropdowns(
  newProjectIndex,
  currentProjectIndex,
  projectPosition,
) {
  const selectProjectSectionDropdowns = document.querySelectorAll(
    '.select-project-section-dropdown-content ul',
  );
  const projectSectionDropdownElementTemplate = createProjectSectionDropdownElementTemplate(newProjectIndex, 0);
  if (currentProjectIndex) {
    const currentSectionsDropdownElements = document.querySelectorAll(
      `.project-section-item[data-project="${currentProjectIndex}"][data-section="0"]`,
    );
    currentSectionsDropdownElements.forEach(
      (currentProjectSectionDropdownElement) => {
        if (projectPosition === 'above') {
          currentProjectSectionDropdownElement.insertAdjacentHTML(
            'beforebegin',
            projectSectionDropdownElementTemplate,
          );
        } else {
          currentProjectSectionDropdownElement.insertAdjacentHTML(
            'afterend',
            projectSectionDropdownElementTemplate,
          );
        }
      },
    );
  } else {
    selectProjectSectionDropdowns.forEach((dropdown) => {
      dropdown.insertAdjacentHTML(
        'beforeend',
        projectSectionDropdownElementTemplate,
      );
    });
  }
}

// Sidebar

const menuButton = document.querySelector('#menu-button');
const menuIcon = document.querySelector('.menu_icon');
const menuCloseIcon = document.querySelector('.close_icon');
export const sideBar = document.querySelector('.sidebar');
let sideBarViewport;
document.addEventListener(
  'DOMContentLoaded',
  () => {
    sideBarViewport = document.querySelector('.sidebar .os-viewport');
  },
  { once: true },
);
const mainOverlay = document.querySelector('.main-overlay');
const minScreenWidth = window.matchMedia('(min-width: 740px)');

menuButton.addEventListener('click', toggleNav);
mainOverlay.addEventListener('click', toggleNav);

function changeMenuIcon() {
  if (menuButton.classList.contains('open')) {
    menuButton.classList.replace('open', 'close');
    menuIcon.style.display = 'none';
    menuCloseIcon.style.display = 'block';
  } else if (menuButton.classList.contains('close')) {
    menuButton.classList.replace('close', 'open');
    menuCloseIcon.style.display = 'none';
    menuIcon.style.display = 'block';
  }
}

let sidebarWasAlreadyOpened;

const changeSidebarWhileResizing = new ResizeObserver((entries) => {
  const mainComputedStyle = getComputedStyle(main);
  const mainMarginLeft = mainComputedStyle.marginLeft;

  entries.forEach((entry) => {
    if (minScreenWidth.matches) {
      if (
        menuButton.classList.contains('open')
        && mainMarginLeft !== '305px'
        && sidebarWasAlreadyOpened
      ) {
        toggleNav();
        sidebarWasAlreadyOpened = false;
      }

      if (
        menuButton.classList.contains('close')
        && mainMarginLeft !== '305px'
      ) {
        toggleNav();
        toggleNav();
      }
    } else if (
      menuButton.classList.contains('close')
      && mainMarginLeft === '305px'
    ) {
      toggleNav();
      sidebarWasAlreadyOpened = true;
    }
  });
});

function toggleNav() {
  changeSidebarWhileResizing.observe(document.querySelector('body'));
  changeMenuIcon();
  if (sideBar.classList.contains('open') === false) {
    sideBar.classList.remove('closed');
    sideBar.classList.add('open');
    openNav();
  } else {
    sideBar.classList.replace('open', 'closed');
    closeNav();
  }
}

const startMainTransitionAnimation = () => {
  main.classList.add('main-transition-effect');
  main.addEventListener('transitionend', () => {
    main.classList.remove('main-transition-effect');
  }, { once: true });
};

function openNav() {
  if (minScreenWidth.matches && !isMobile) {
    main.style.marginLeft = '305px';
    startMainTransitionAnimation();
    mainOverlay.style.opacity = '0';
    mainOverlay.style.pointerEvents = 'none';
  } else {
    main.style.marginLeft = '0px';
    startMainTransitionAnimation();
    mainOverlay.style.opacity = '1';
    mainOverlay.style.pointerEvents = 'all';
  }
}

function closeNav() {
  if (isMobile) {
    setTimeout(() => {
      sideBarViewport.scrollTo(0, 0);
    }, 250);
  }

  main.style.marginLeft = '0px';
  mainOverlay.style.opacity = '0';
  mainOverlay.style.pointerEvents = 'none';
  startMainTransitionAnimation();
}

document.addEventListener('click', (event) => {
  if (event.target.matches('.sidebar-item')) {
    const currentSidebarElement = event.target;
    saveTaskBoxTask();

    if (isMobile) {
      setTimeout(() => {
        sideBarViewport.scrollTo(0, 0);
      }, 250);
    }

    const toggledCompletedTasksButton = document.querySelector(
      '.toggle-completed-tasks.hide',
    );

    if (toggledCompletedTasksButton) {
      toggledCompletedTasksButton.click();
    }

    const previusSidebarElement = document.querySelector(
      '.sidebar-item.selected',
    );
    if (previusSidebarElement) {
      previusSidebarElement.classList.remove('selected');
    }

    const projectIndex = currentSidebarElement.dataset.project;
    const currentProjectContainer = document.querySelector(
      `.main-content[data-project="${projectIndex}"]`,
    );

    const previusProjectContainer = document.querySelector(
      '.main-content.enabled',
    );
    if (previusProjectContainer !== currentProjectContainer) {
      main.scrollTo({ top: 0 });
      previusProjectContainer.classList.remove('enabled');

      function setDisplayNone() {
        previusProjectContainer.style.display = 'none';
      }

      previusProjectContainer.addEventListener('animationend', setDisplayNone, {
        once: true,
      });
      previusProjectContainer.classList.add('disabled');
    }

    currentSidebarElement.classList.add('selected');

    currentProjectContainer.classList.remove('disabled');
    currentProjectContainer.style.display = null;
    currentProjectContainer.classList.add('enabled');

    if (!minScreenWidth.matches && sideBar.classList.contains('open') || isMobile) {
      toggleNav();
    }
  }
});

export const sidebarProjectsList = document.querySelector('.projects-list');
const projectsAccordion = document.querySelector('.projects-accordion');

projectsAccordion.addEventListener('click', function toggleAccordion() {
  this.classList.toggle('active');
  if (this.classList.contains('active')) {
    sidebarProjectsList.style.maxHeight = `${sidebarProjectsList.scrollHeight}px`;
    sidebarProjectsList.style.opacity = '1';
  } else {
    sidebarProjectsList.style.maxHeight = null;
    sidebarProjectsList.style.opacity = null;
  }
});

function setProjectsAccordionMaxHeight() {
  if (projectsAccordion.classList.contains('active')) {
    sidebarProjectsList.style.maxHeight = '100%';
  }
}

projectsAccordion.addEventListener(
  'transitionend',
  setProjectsAccordionMaxHeight,
);
