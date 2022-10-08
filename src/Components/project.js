import React, { useState } from "react";

const App = () => {
  return (
    <div className="main-content" data-project="">
      <div className="main-header">
        <span className="main-title project-item-title"></span>
        <div className="inbox-header-icons main-icons">
          <button
            className="project-comments"
            data-modal-target=".project-comments-modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              data-svgs-path="sm1/comments.svg"
            >
              <path
                fill="#808080"
                fill-rule="nonzero"
                d="M11.707 20.793A1 1 0 0 1 10 20.086V18H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4.5l-2.793 2.793zM11 20.086L14.086 17H19a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h6v3.086z"
              ></path>
            </svg>
            <span className="project-comments-content"></span>
          </button>

          <div className="project-options-dropdown">
            <button className="project-options">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <g
                  fill="currentColor"
                  stroke="currentcolor"
                  stroke-linecap="round"
                  transform="translate(3 10)"
                >
                  <circle cx="2" cy="2" r="2"></circle>
                  <circle cx="9" cy="2" r="2"></circle>
                  <circle cx="16" cy="2" r="2"></circle>
                </g>
              </svg>
            </button>

            <div className="project-options-dropdown-content dropdown">
              <ul>
                <li
                  className="project-option edit-project"
                  data-modal-target=".edit-project-modal"
                >
                  <div className="project-option-icon">
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
                  </div>
                  <div className="project-option-content">Edit Project</div>
                </li>

                <li className="project-option toggle-completed-tasks">
                  <div className="show-completed-tasks show">
                    <div className="project-option-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-1a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.9-11.4a.5.5 0 0 1 .7.8l-6 6a.5.5 0 0 1-.7 0l-2.5-2.5a.5.5 0 0 1 .7-.8l2.1 2.2L16 8.6z"
                        ></path>
                      </svg>
                    </div>
                    <div className="project-option-content">
                      Show completed tasks
                    </div>
                  </div>

                  <div className="hide-completed-tasks">
                    <div className="hide-completed-tasks">
                      <div className="project-option-icon">
                        <svg width="24" height="24">
                          <path
                            fill="currentColor"
                            fill-rule="nonzero"
                            d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 1a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm3.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="project-option-content">
                        Hide completed tasks
                      </div>
                    </div>
                  </div>
                </li>

                <li
                  className="project-option delete-project"
                  data-modal-target=".delete-modal"
                >
                  <div className="project-option-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                    >
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
                  </div>
                  <div className="project-option-content">Delete Project</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="main-to-do-list">
        <section data-section="0">
          <div className="section-content active">
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

        <div className="empty-state active">
          <div className="empty-state-content">
            <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <g
                className="ldl-scale"
                style="transform-origin: 142% 50%; transform: rotate(0deg) scale(0.8, 0.8); animation-play-state: paused;"
                transform="matrix(1.085782, 0, 0, 0.759845, -11767.899414, 10319.396484)"
              >
                <path
                  d="M -4.922 39.266 C -4.922 39.266 85.193 107.648 222.188 -20.216 C 343.852 -133.77 443.195 45.393 443.89 131.192 C 444.792 242.336 322.226 331.264 381.705 404.264 C 441.189 477.263 263.747 597.811 168.115 493.485 C 49.154 363.708 16.925 469.153 -50.884 469.153 C -99.551 469.153 -199.469 348.229 -131.995 258.266 C -75.219 182.559 -106.185 157.437 -121.179 131.192 C -142.81 93.339 -91.439 -9.4 -4.922 39.266 Z"
                  fill="var(--lightestColor)"
                  style=""
                ></path>
                <path
                  d="M 75.237 308.687 C 66.416 305.877 56.767 308.422 50.48 315.216 C 44.037 322.282 42.645 331.489 45.335 339.364 C 46.614 343.106 46.372 347.151 44.309 350.522 L 43.973 351.085 C 41.569 355.247 40.482 359.629 40.658 363.356 C 40.926 369.062 39.785 374.746 36.602 379.491 L 36.268 379.992 C 32.847 385.187 28.807 390.02 26.233 395.7 C 23.616 401.356 21.288 407.178 20.179 413.708 L 20.904 414.124 C 26.001 409.9 29.881 404.973 33.47 399.874 C 37.103 394.805 39.27 388.889 42.058 383.331 L 42.326 382.784 C 44.846 377.655 49.192 373.825 54.271 371.201 C 57.588 369.493 60.837 366.361 63.24 362.193 L 63.516 361.702 C 65.423 358.237 68.78 355.92 72.659 355.163 C 79.479 353.849 85.389 349.637 88.856 343.62 C 96.529 330.301 89.902 313.299 75.237 308.687 Z"
                  style="animation-play-state: paused; fill: var(--mainColor);"
                ></path>
                <path
                  d="M 195.672 234.343 L 142.581 317.83 L 146.184 319.907 L 177.386 343.989 L 203.495 306.57 C 206.233 300.785 207.066 294.28 205.87 287.993 L 195.672 234.343 Z"
                  style="animation-play-state: paused; fill: var(--darkestColor);"
                ></path>
                <path
                  d="M 22.035 201.809 L 2.68 243.13 L 39.136 258.107 L 43.921 260.869 L 90.615 171.726 L 36.935 190.465 C 30.89 192.572 25.675 196.544 22.035 201.809 Z"
                  style="animation-play-state: paused; fill: var(--darkestColor);"
                ></path>
                <path
                  d="M 133.444 267.841 L 90.601 243.106 L 42.018 304.481 L 104.583 340.604 L 133.444 267.841 Z"
                  fill="#666"
                  style="fill: var(--darkestColor); animation-play-state: paused;"
                ></path>
                <path
                  d="M 252.641 62.682 C 253.182 50.064 245.156 38.665 233.093 34.922 C 225.02 32.385 216.199 34.049 209.057 38.591 L 154.029 73.601 C 148.645 77.036 143.944 81.44 140.165 86.59 L 245.477 147.39 C 248.032 141.554 249.518 135.289 249.791 128.89 L 252.641 62.682 Z"
                  style="animation-play-state: paused; fill: var(--darkestColor);"
                ></path>
                <path
                  d="M 137.001 91.376 L 90.615 171.726 L 43.921 260.869 L 142.581 317.83 L 195.672 234.343 L 242.913 152.523 C 243.87 150.863 244.711 149.14 245.477 147.39 L 140.165 86.59 C 139.032 88.124 137.962 89.712 137.001 91.376 Z"
                  style="animation-play-state: paused; fill: var(--lightColor);"
                ></path>
                <circle
                  r="26.367"
                  cy="37.939"
                  cx="57.535"
                  transform="matrix(0.5, -0.866025, 0.866025, 0.5, 99.771136, 200.816203)"
                  style="animation-play-state: paused; fill: var(--lightestColor);"
                ></circle>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
                <g
                  transform="matrix(0.197115, 0, 0, 0.197115, 286.609863, -31.349064)"
                  style=""
                ></g>
              </g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.077972, 0, 0, 0.077972, 377.276642, 58.321598)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
              <g
                transform="matrix(0.107856, 0, 0, 0.107856, 56.125374, 352.957886)"
                style=""
              ></g>
            </svg>
            <div className="empty-state-header">What will you accomplish?</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
