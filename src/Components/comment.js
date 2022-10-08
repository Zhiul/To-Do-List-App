import React, { useState } from "react";

const App = () => {
  return (
    <div class="comment" data-index="">
      <img src="./assets/user-icon.png" alt="user-icon" class="user-icon" />
      <div class="comment-content">
        <div class="comment-header">
          <span class="user-name">User</span>
          <span class="time"></span>
          <div class="comment-actions">
            <button type="button" class="edit-comment">
              <svg width="24" height="24" aria-hidden="true">
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
            <button
              type="button"
              class="delete-comment"
              data-modal-target=".delete-modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                aria-hidden="true"
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
            </button>
          </div>
        </div>
        <p class="comment-description"></p>
      </div>
    </div>
  );
};

export default App;
