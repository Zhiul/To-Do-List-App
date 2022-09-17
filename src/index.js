import flatpickr from "flatpickr";
import tippy, { delegate } from "tippy.js";
import { toDoProjects } from "./logic.js";
import "tippy.js/dist/tippy.css";

import { firstPageLoad } from "./firstPageLoad";
import { initializeProjectComments } from "./comments.js";
import { initializeDeleteEventListeners } from "./delete.js";
import { dueDateToolTipTemplate } from "./elementsTemplates.js";
import { main } from "./utilities.js";
import { isMobile } from "./mobile.js";

require("flatpickr/dist/themes/material_red.css");

const _ = require("lodash");

const root = document.documentElement;

window.a = toDoProjects;

// Tasks Duedate Tooltip

delegate("main", {
  target: ".task-duedate-button",
  content: "",
  allowHTML: true,
  arrow: false,
  offset: [0, 3],
  placement: "bottom",
  onShow(instance) {
    let task;
    let tasksDueNumber;
    const setToolTipContent = () => {
      const dueDateButtonHovered = main.querySelector(
        ".task-duedate-button:hover"
      );
      const dueDateContent = dueDateButtonHovered.querySelector(
        ".task-duedate-content"
      ).textContent;
      tasksDueNumber = Array.from(
        document.querySelectorAll(
          ".task-item:not(.completed):not([data-project]) .task-duedate-content"
        )
      ).filter((el) => el.textContent === dueDateContent).length;
      const taskIndex = parseInt(
        dueDateButtonHovered.closest("[data-task-index]").dataset.taskIndex
      );
      const sectionIndex = parseInt(
        dueDateButtonHovered.closest("[data-section]").dataset.section
      );
      const projectIndex = parseInt(
        dueDateButtonHovered.closest("[data-project]").dataset.project
      );
      const taskIsCompleted = !!dueDateButtonHovered.closest(".completed");

      if (taskIsCompleted) {
        task =
          toDoProjects.projects[projectIndex].sections[sectionIndex]
            .completedTasks[taskIndex];
      } else {
        task =
          toDoProjects.projects[projectIndex].sections[sectionIndex].tasks[
            taskIndex
          ];
      }

      instance.setContent(dueDateToolTipTemplate(task, tasksDueNumber));
      instance.popper.classList.add("task-duedate-tooltip");
    };
    setToolTipContent();
  },
});

function convertRemToPixels(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function removeTooltip() {
  const tooltipElement = document.querySelector('[aria-describedby*="tippy"]');
  if (tooltipElement) {
    tooltipElement._tippy.hide();
  }
}

function stylePinnedSectionTop() {
  const x = isMobile ? window.innerWidth - 10 : window.innerWidth * 0.5;
  const y = isMobile
    ? convertRemToPixels(1.75) + 23
    : convertRemToPixels(6) + 54;
  const projectHeader = document.querySelector(
    ".main-content.enabled .main-header"
  );
  const previousSectionTopElement = document.querySelector(
    ".section-top.pinned"
  );

  if (document.elementFromPoint(x, y).matches(".section-top")) {
    const sectionTopElement = document.elementFromPoint(x, y);
    if (
      previousSectionTopElement &&
      previousSectionTopElement === sectionTopElement
    ) {
      return;
    }

    projectHeader.classList.remove("pinned");
    if (previousSectionTopElement) {
      previousSectionTopElement.classList.remove("pinned");
    }
    sectionTopElement.classList.add("pinned");
  } else {
    if (previousSectionTopElement) {
      previousSectionTopElement.classList.remove("pinned");
    }

    if (main.scrollTop !== 0) {
      projectHeader.classList.add("pinned");
    } else {
      projectHeader.classList.remove("pinned");
    }
  }
}

main.addEventListener("scroll", _.throttle(removeTooltip, 150));
main.addEventListener("scroll", _.throttle(stylePinnedSectionTop, 150));

function setVhCSSVariable() {
  root.style.setProperty("--100vh", `${window.innerHeight}px`);

  root.style.setProperty("--vh", `${window.innerHeight / 100}px`);
}
window.addEventListener("resize", setVhCSSVariable);
