import React, { useState } from "react";

const App = () => {
  return (
    <section data-section="">
      <div className="section-top">
        <div className="section-title"></div>

        <button
          type="button"
          className="delete-section"
          data-modal-target=".delete-modal"
        >
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

        <div className="section-expand" role="button">
          <svg width="16px" height="16px" viewBox="0 0 16 16">
            <g transform="translate(-266, -17)" fill="currentColor">
              <path d="M280,22.7581818 L279.1564,22 L273.9922,26.506 L273.4414,26.0254545 L273.4444,26.0281818 L268.8562,22.0245455 L268,22.7712727 C269.2678,23.878 272.8084,26.9674545 273.9922,28 C274.8718,27.2330909 274.0144,27.9809091 280,22.7581818"></path>
            </g>
          </svg>
        </div>
      </div>

      <div className="section-content">
        <ul className="tasks-items"></ul>

        <div className="add-task-container">
          <button className="add-task">
            <span className="add-icon">
              <svg width="13" height="13">
                <path
                  d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z"
                  fill="#dd4b39"
                  fill-rule="evenodd"
                ></path>
              </svg>
            </span>
            <span className="add-task-text">Add task</span>
          </button>
        </div>

        <ul className="completed-tasks-items"></ul>
      </div>

      <form className="add-section-container" autocomplete="off">
        <button className="add-section-hover" type="button">
          Add Section
        </button>
      </form>
    </section>
  );
};

const App2 = () => {
  return (
    <div className="add-section-box">
      <input
        type="text"
        name="section-name"
        className="section-title"
        placeholder="Name this section"
        maxlength="300"
        autocomplete="off"
      />

      <div className="add-section-box-buttons">
        <button id="add-section" type="button">
          Add Section
        </button>
        <button id="cancel-add-section" type="button">
          Cancel
        </button>
      </div>
    </div>
  );
};

const App3 = () => {
  return (
    <li
      className="project-section-item"
      data-project="${projectIndex}"
      data-section="${sectionIndex}"
    >
      <span className="project-item-icon"></span>
      <span className="project-item-title"></span>
    </li>
  );
};

export default App;
