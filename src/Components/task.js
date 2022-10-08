import React, { useState } from "react";
import { DateTime } from "luxon";
import { set } from "lodash";

const DueDateButton = ({ type, content, duedateTimeZoneStatus }) => {
  return (
    <button className="task-duedate-button" data-type={type}>
      <span className="task-duedate">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="calendar_icon"
        >
          <path
            fill="currentColor"
            fill-rule="nonzero"
            d="M9.5 1A1.5 1.5 0 0 1 11 2.5v7A1.5 1.5 0 0 1 9.5 11h-7A1.5 1.5 0 0 1 1 9.5v-7A1.5 1.5 0 0 1 2.5 1h7zm0 1h-7a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5zM8 7.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zM8.5 4a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h5z"
          ></path>
        </svg>
        <span className="task-duedate-content">{content}</span>
        <span className="timezone" data-status={duedateTimeZoneStatus}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style="/* width: 21px; *//* height: 21px; */"
          >
            <path
              d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm7 8.7v.3c0 .1 0 .3-.1.4 0 .1-.1.3-.1.4 0 .1 0 .2-.1.3 0 .1-.1.3-.1.4 0 .1 0 .1-.1.2-.1.2-.1.3-.2.5 0 0 0 .1-.1.1-.1.2-.2.3-.3.5v.1c-.1.2-.2.3-.3.5-.1.2-.3.3-.4.5-.2-.7-.9-1.2-1.7-1.2h-.9v-2.6c0-.5-.4-.9-.9-.9H8.5v-1.8h1.8c.5 0 .9-.4.9-.9V7.6H13c1 0 1.8-.8 1.8-1.8v-.3c.3.1.6.3.9.5.6.3 1.1.8 1.6 1.3.4.5.8 1 1.1 1.6 0 0 0 .1.1.1.3.6.5 1.2.6 1.8v.2c0 .3.1.6.1 1 0-.3 0-.6-.1-1 0 .3.1.6.1 1-.2.2-.2.5-.2.7zm0 0v.2c-.1 0 0-.1 0-.2zm-.1.7c0 .1 0 .2-.1.3 0-.1 0-.2.1-.3zm-.2.6c0 .1-.1.2-.1.3 0-.1.1-.2.1-.3zm-.2.6c0 .1-.1.2-.1.3 0-.1 0-.2.1-.3zm-.3.6c-.1.1-.1.2-.2.3.1-.1.1-.2.2-.3zm-.3.6c-.1.1-.1.2-.2.3 0-.1.1-.2.2-.3zm-.4.5c-.1.1-.1.2-.2.3 0-.1.1-.2.2-.3zM14.7 5.5c.3.1.6.3.8.4-.3-.1-.6-.3-.8-.4zM18.3 9c.1.3.2.5.3.8 0-.2-.1-.5-.3-.8zm.4.9c.1.3.2.6.2.9-.1-.3-.1-.6-.2-.9zm-1-1.9c-.2-.2-.3-.5-.5-.7.2.2.4.5.5.7zm.5.8c-.1-.3-.3-.5-.5-.8.3.3.4.6.5.8zm-1.1-1.6c-.2-.2-.4-.4-.7-.6.2.2.5.4.7.6zM15.6 6c.2.1.5.3.7.5-.2-.2-.4-.3-.7-.5zM5 11.2v.8c0-.5.1-1.1.2-1.6l4.2 4.2v.9c0 1 .8 1.8 1.8 1.8V19c-1-.1-2-.5-2.9-1 0 0-.1 0-.1-.1-.1-.1-.2-.2-.3-.2-.1 0-.1-.1-.2-.1-.1-.1-.2-.2-.3-.2l-.2-.2c-.1-.2-.2-.3-.3-.4-.1-.1-.1-.2-.2-.2-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.1-.3 0-.1-.1-.2-.1-.3 0-.1-.1-.2-.1-.3 0-.1-.1-.2-.1-.3 0-.1-.1-.2-.1-.4 0-.1 0-.2-.1-.3 0-.1 0-.3-.1-.4V11.2zm.2-.7c0 .2-.1.3-.1.5 0-.2 0-.3.1-.5zm5.6 8.4h-.3.3zm-.7-.2c-.1 0-.2 0-.2-.1.1.1.2.1.2.1zm-.7-.2c-.1 0-.2-.1-.3-.1.1 0 .2 0 .3.1zm-.7-.3c-.1 0-.2-.1-.3-.2.1.1.2.1.3.2zm-.6-.4c-.1-.1-.2-.1-.3-.2.2.1.3.2.3.2zm-.5-.3c-.1-.1-.2-.1-.2-.2.1 0 .1.1.2.2zm-.9-.9c-.1-.1-.1-.2-.2-.2.1 0 .1.1.2.2zm-.4-.6c-.1-.1-.1-.2-.2-.2.1.1.1.2.2.2zm-.4-.5c0-.1-.1-.2-.1-.3 0 .1.1.2.1.3zm-.3-.6c0-.1-.1-.2-.1-.3.1.1.1.2.1.3zm-.2-.6c0-.1-.1-.2-.1-.3 0 .1.1.2.1.3zm-.2-.7c0-.1 0-.2-.1-.2.1 0 .1.1.1.2zm-.1-.7v-.2c-.1.1 0 .1 0 .2zm1.8 3.9l.2.2-.2-.2z"
              fill="currentColor"
            ></path>
          </svg>
        </span>
      </span>
    </button>
  );
};

const Task = ({
  index,
  title,
  description,
  dueDate,
  priority,
  dueDateTimeZone,
}) => {
  const dueDate = (() => {
    const date = dueDate;
    let type, content, duedateTimeZoneStatus;
    const setDateProperties = (() => {
      duedateTimeZoneStatus = (() => {
        if (!dueDateTimeZone) return "disabled";
        dueDateTimeZone && dueDateTimeZone !== localTimeZone
          ? "active"
          : "disabled";
      })();

      const dueDateIsToday = date.startOf("day").ts === now.startOf("day").ts;
      const dueDateIsThisYear = dueDate.year === now.year;

      const formatDate = (format) => date.toFormat("LLL d");
      const set = (contentValue, typeValue = "date") =>
        ([content, type, timeZoneStatus] = [contentValue, typeValue]);

      const dueDateCase = (() => {
        if (date == undefined) return "undefined";
        if (dueDateIsToday) return "todayDueDate";
        if (dueDate < now)
          return dueDateIsThisYear ? "currentYearOverdueDate" : "overdueDate";
        return "upcomingDate";
      })();

      switch (dueDateCase) {
        case "todayDueDate":
          set("Today", "Today");
          break;

        case "currentYearOverdueDate":
          set(format("LLL d"), "Overdue");
          break;

        case "overdueDate":
          set(format("LLL d y"), "Overdue");
          break;

        case "upconmingDate":
          set(format("LLL d"), "Upcoming");
          break;

        default:
          break;
      }
    })();
    return { type, content, duedateTimeZoneStatus };
  })();

  return (
    <li className="task-item">
      <div className="task" role="button">
        <div className="task-top">
          <div className="task-checkbox" data-priority={priority}>
            <svg width="24" height="24">
              <path
                fill="#808080"
                d="M11.23 13.7l-2.15-2a.55.55 0 0 0-.74-.01l.03-.03a.46.46 0 0 0 0 .68L11.24 15l5.4-5.01a.45.45 0 0 0 0-.68l.02.03a.55.55 0 0 0-.73 0l-4.7 4.35z"
              ></path>
            </svg>
          </div>
          <div className="task-title">{title}</div>
        </div>

        <div className="task-description">{description}</div>

        <div className="task-info-tags">
          {dueDate.date && <DueDateButton {...dueDate}></DueDateButton>}
        </div>

        <div className="task-buttons">
          <button type="button" className="edit-task-button">
            <svg width="24" height="24">
              <g fill="none" fill-rule="evenodd">
                <path
                  fill="currentColor"
                  d="M9.5 19h10a.5.5 0 110 1h-10a.5.5 0 110-1z"
                ></path>
                <path
                  stroke="currentColor"
                  d="M4.42 16.03a1.5 1.5 0 00-.43.9l-.22 2.02a.5.5 0 00.55.55l2.02-.21a1.5 1.5 0 00.9-.44L18.7 7.4a1.5 1.5 0 000-2.12l-.7-.7a1.5 1.5 0 00-2.13 0L4.42 16.02z"
                ></path>
              </g>
            </svg>
          </button>

          <button type="button" className="delete-task">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <g fill="none" fill-rule="evenodd">
                <path d="M0 0h24v24H0z"></path>
                <rect
                  width="14"
                  height="1"
                  x="5"
                  y="6"
                  fill="currentColor"
                  rx=".5"
                ></rect>
                <path
                  fill="currentColor"
                  d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"
                ></path>
                <path
                  stroke="currentColor"
                  d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
};

const TaskBox = () => {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.title : "");
  const [priority, setPriority] = useState(task ? task.title : "");
  const [dueDate, setDueDate] = useState(task ? task.dueDate : undefined);

  const getDefaultDueDate = () =>
    projectIndex.matches("Today") ? DateTime.now().endOf("day") : undefined;

  const resetValues = () => {
    setTitle("");
    setDescription("");
    setPriority(4);
    setDueDate("");
  };

  return (
    <form className="add-task-box-container task-box-c" autocomplete="off">
      <div className="add-task-box task-box">
        <div className="task-inputs">
          <textarea
            name="task-title"
            rows="1"
            cols="30"
            className="task-input task-title"
            placeholder="Task name"
            maxLength="500"
          ></textarea>

          <textarea
            name="add-task-description"
            cols="30"
            className="add-task-description task-input textarea-task-description"
            placeholder="Description"
            maxLength="16384"
          ></textarea>
        </div>

        <div className="task-fields">
          <div className="left-task-fields">
            <div className="schedule-duedate">
              <div className="duedate-selector">
                <div className="calendar-icon">
                  <svg
                    data-svgs-path="sm1/calendar_small.svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="nonzero"
                      d="M12 2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8zm0 1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1.25 7a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm.75-5a.5.5 0 1 1 0 1h-7a.5.5 0 0 1 0-1h7z"
                    ></path>
                  </svg>
                </div>
                <div className="selected-duedate">Schedule</div>
                <input
                  type="text"
                  className="schedule-input"
                  autocomplete="off"
                />
              </div>
            </div>

            <div className="select-project-section">
              <button
                type="button"
                className="selected-project-section"
                data-project="0"
                data-section="0"
              >
                <span className="project-item-icon"></span>
                <span className="project-item-content">
                  <span className="project-item-title"></span>
                  <span className="project-item-section-title"></span>
                </span>
              </button>

              <div className="select-project-section-dropdown-content dropdown">
                <ul></ul>
                <div className="arrow"></div>
              </div>
            </div>
          </div>

          <div className="select-priority-dropdown">
            <button
              type="button"
              className="selected-priority"
              data-priority="4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fill-rule="nonzero"
                  d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"
                ></path>
              </svg>
            </button>
            <div className="select-priority-dropdown-content dropdown">
              <span className="priority-item" data-priority="1">
                <span className="priority-item-info">
                  <span className="priority-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#d1453b"
                        fill-rule="nonzero"
                        d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"
                      ></path>
                    </svg>
                  </span>

                  <span className="Priority-title">Priority 1</span>
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12 12"
                  width="20"
                  height="20"
                >
                  <path
                    fill="transparent"
                    fill-rule="evenodd"
                    d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"
                  ></path>
                </svg>
              </span>

              <span className="priority-item" data-priority="2">
                <span className="priority-item-info">
                  <span className="priority-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#eb8909"
                        fill-rule="nonzero"
                        d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"
                      ></path>
                    </svg>
                  </span>

                  <span className="Priority-title">Priority 2</span>
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12 12"
                  width="20"
                  height="20"
                >
                  <path
                    fill="transparent"
                    fill-rule="evenodd"
                    d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"
                  ></path>
                </svg>
              </span>

              <span className="priority-item" data-priority="3">
                <span className="priority-item-info">
                  <span className="priority-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#246fe0"
                        fill-rule="nonzero"
                        d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"
                      ></path>
                    </svg>
                  </span>

                  <span className="Priority-title">Priority 3</span>
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12 12"
                  width="20"
                  height="20"
                >
                  <path
                    fill="transparent"
                    fill-rule="evenodd"
                    d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"
                  ></path>
                </svg>
              </span>

              <span className="priority-item selected" data-priority="4">
                <span className="priority-item-info">
                  <span className="priority-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="rgb(192, 192, 192)"
                        fill-rule="nonzero"
                        d="M5 13.777V19.5a.5.5 0 1 1-1 0V5a.5.5 0 0 1 .223-.416C5.313 3.857 6.742 3.5 8.5 3.5c1.113 0 1.92.196 3.658.776C13.796 4.82 14.53 5 15.5 5c1.575 0 2.813-.31 3.723-.916A.5.5 0 0 1 20 4.5V13a.5.5 0 0 1-.223.416c-1.09.727-2.519 1.084-4.277 1.084-1.113 0-1.92-.196-3.658-.776C10.204 13.18 9.47 13 8.5 13c-1.45 0-2.614.262-3.5.777z"
                      ></path>
                    </svg>
                  </span>

                  <span className="Priority-title">Priority 4</span>
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12 12"
                  width="20"
                  height="20"
                >
                  <path
                    fill="transparent"
                    fill-rule="evenodd"
                    d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"
                  ></path>
                </svg>
              </span>
            </div>

            <div className="dropdown-overlay"></div>
          </div>
        </div>
      </div>

      <div className="add-task-box-buttons">
        <button type="button" className="add-todo action-todo">
          Add task
        </button>
        <button type="button" className="cancel-task">
          Cancel
        </button>
      </div>
    </form>
  );
};

const ProjectSectionDropdownItem = ({ projectIndex, sectionIndex }) => {
  const isInboxProject = projectIndex === 0;
  const isDefaultSection = sectionIndex === 0;
  const projectColor = !isInboxProject
    ? toDoProjects.getProject(projectIndex).color
    : null;

  const content = isProject
    ? toDoProjects.getProject(projectIndex).title
    : toDoProjects.getProject(projectIndex).getSection(sectionIndex).title;

  return (
    <li className="project-section-item">
      <span className="project-item-icon">{itemContent}</span>
      <span className="project-item-title">{content}</span>
    </li>
  );
};

const itemContent = ({ isInboxProject, isDefaultSection, projectColor }) => {
  if (isInboxProject && isDefaultSection) <InboxIcon />;
  if (isDefaultSection) <CircleIcon color={projectColor} />;
  return <SectionIcon />;
};

const SelectedProjectSectionButton = () => {
  return (
    <button type="button" className="selected-project-section">
      <span className="project-item-icon"></span>
      <span className="project-item-content">
        <span className="project-item-title"></span>
        <span className="project-item-section-title"></span>
      </span>
    </button>
  );
};

const InboxIcon = () => (
  <svg
    className="feather feather-inbox"
    fill="none"
    height="24"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    style="width: 20px; height: 20px; transform: scaleY(1.16); color: #157EFB;"
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
  </svg>
);

const CircleIcon = ({ color }) => (
  <span className="circle" data-color={color}></span>
);

const SectionIcon = () => (
  <svg
    data-svgs-path="sm1/section.svg"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="#808080"
      fill-rule="nonzero"
      d="M17.5 20c.276 0 .5.224.5.5s-.224.5-.5.5h-11c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h11zM16 8c1.105 0 2 .895 2 2v5c0 1.105-.895 2-2 2H8c-1.105 0-2-.895-2-2v-5c0-1.105.895-2 2-2h8zm0 1H8c-.513 0-.936.386-.993.883L7 10v5c0 .513.386.936.883.993L8 16h8c.513 0 .936-.386.993-.883L17 15v-5c0-.513-.386-.936-.883-.993L16 9zm1.5-5c.276 0 .5.224.5.5s-.224.5-.5.5h-11c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h11z"
    ></path>
  </svg>
);

export default App;
