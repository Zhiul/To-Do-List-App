import { toDoProjects, projectCreate, saveToDoProjects } from './logic';
import { main, changeTextareaHeightOnInput } from './utilities';
import {
  acceptsInput,
  previousPortraitOrientationKeyboardHeight,
  previousLandscapeOrientationKeyboardHeight,
  portraitOrientationHighestHeight,
  landscapeOrientationHighestHeight,
  actualHeight,
  screenOrientation,
  virtualKeyboard,
} from './virtualKeyboard';
import { getScreenOrientation } from './screenOrientation';
import {
  createElementFromTemplate,
  createCommentTemplate,
  createEditCommentContainerTemplate,
} from './elementsTemplates';
import { closeModals } from './modals';

export const initializeProjectComments = (() => {
  const projectCommentsModal = document.querySelector(
    '.project-comments-modal',
  );
  const commentsContainerWrapper = document.querySelector(
    '.comments-container-wrapper',
  );
  const commentsContainer = document.querySelector('.comments-container');
  let lastVisibleElement;
  const addCommentInput = document.querySelector('.comment-text');
  const commentBox = document.querySelector('.add-comment-box');

  addCommentInput.addEventListener('input', changeTextareaHeightOnInput, false);
  addCommentInput.addEventListener(
    'input',
    checkCommentInputCharacterLimit,
    false,
  );

  addCommentInput.addEventListener('touchend', (e) => {
    scrollCommentsContainer(e);
  });

  commentsContainerWrapper.addEventListener('scroll', _.debounce(() => { getLastVisibleElement(null, null); }, 300));

  let previousScreenOrientation;
  let screenOrientation;
  let changeOrientation;

  function setScreenOrientationValues() {
    previousScreenOrientation = screenOrientation;
    screenOrientation = getScreenOrientation();
  }

  function detectChangeOrientation() {
    changeOrientation = previousScreenOrientation
    !== screenOrientation;

    setTimeout(() => {
      changeOrientation = false;
    }, 340);
  }

  function changeCommentsContainerScrollPositionAfterScreenRotation() {
    setTimeout(() => {
      if (projectCommentsModal.classList.contains('disabled') || !changeOrientation) return;

      lastVisibleElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 300);
  }

  window.addEventListener('resize', setScreenOrientationValues);
  window.addEventListener('resize', detectChangeOrientation);
  window.addEventListener('resize', changeCommentsContainerScrollPositionAfterScreenRotation);

  function getLastVisibleElement(offset, commentsWrapper) {
    if (changeOrientation) return;

    const comments = document.querySelectorAll('.comment');
    const x = 30;

    const y = commentsContainerWrapper.getBoundingClientRect().bottom - 2;

    if (document.elementFromPoint(x, y).closest('.comment')) {
      lastVisibleElement = document
        .elementFromPoint(x, y)
        .closest('.comment');
    } else if (comments.length > 0) {
      lastVisibleElement = comments[comments.length - 1];

      if (!commentsWrapper) return;

      commentsWrapper.emptySpace.el.style.flex = '1';
      if (!commentsWrapper.emptySpace.height) {
        commentsWrapper.emptySpace.height = commentsWrapper.emptySpace.el.offsetHeight;
        if (commentsWrapper.emptySpace.height) {
          commentsWrapper.emptySpace.hadHeight = true;
        }
      }
    } else {
      lastVisibleElement = null;
    }

    if (lastVisibleElement && offset) {
      offset.value = commentsContainerWrapper.getBoundingClientRect().bottom
        - lastVisibleElement.getBoundingClientRect().top
        - lastVisibleElement.offsetHeight;
    } else if (offset) {
      offset.value = null;
    }
  }

  let previousCommentInputHeight = addCommentInput.offsetHeight;

  const changeCommentsContainerScrollPosition = new ResizeObserver(
    (entries) => {
      entries.forEach((entry) => {
        const input = entry.target;

        function getActualCommentInputHeight() {
          let height = input.style.height
            ? parseInt(input.style.height)
            : input.offsetHeight;
          const maxHeight = parseInt(getComputedStyle(input).maxHeight);

          if (height > maxHeight) {
            height = maxHeight;
          }

          return height;
        }

        const actualCommentInputHeight = getActualCommentInputHeight();
        if (actualCommentInputHeight === previousCommentInputHeight) return;

        const heightDifference = actualCommentInputHeight - previousCommentInputHeight;

        const y = commentsContainerWrapper.scrollTop + heightDifference;

        commentsContainerWrapper.scrollTop = commentsContainerWrapper.scrollHeight
          - (commentsContainerWrapper.scrollTop
            + commentsContainerWrapper.offsetHeight);
        commentsContainerWrapper.classList.add('transitioning');

        function changeCommentsContainerWrapperScroll() {
          commentsContainerWrapper.scrollTop = y;
          commentsContainerWrapper.classList.remove('transitioning');
          input.transitioned = true;
        }

        input.transitioned = false;
        input.addEventListener(
          'transitionend',
          changeCommentsContainerWrapperScroll,
          { once: true },
        );

        setTimeout(() => {
          if (input.transitioned === false) {
            commentsContainerWrapper.classList.remove('transitioning');
            input.removeEventListener(
              'transitionend',
              changeCommentsContainerWrapperScroll,
              { once: true },
            );
          }
        }, 100);

        previousCommentInputHeight = actualCommentInputHeight;
      });
    },
  );

  changeCommentsContainerScrollPosition.observe(addCommentInput);

  function scrollCommentsContainer(e) {
    if (e) e.preventDefault();

    setTimeout(() => {
      addCommentInput.focus();
    }, 30);

    const commentsWrapper = (() => {
      const emptySpace = (() => {
        const el = document.querySelector(
          '.comments-container-wrapper-empty',
        );
        let height;
        let hadHeight;

        return { el, height, hadHeight };
      })();

      return { emptySpace };
    })();

    let previousProjectCommentsModalHeight = projectCommentsModal.offsetHeight;
    let previousCommentsContainerWrapperScrollTop = commentsContainerWrapper.scrollTop;
    let previousCommentsContainerWrapperHeight = commentsContainerWrapper.offsetHeight;

    const offset = {
      value: 0,
    };

    getLastVisibleElement(offset, commentsWrapper);

    function toggleCommentsContainerScrollPosition(
      collapsing,
      previousHeight,
      commentsWrapper,
    ) {
      if (lastVisibleElement) {
        let finalModalHeight;
        const topValue = commentsContainerWrapper.scrollHeight
          - (previousCommentsContainerWrapperScrollTop
            + previousCommentsContainerWrapperHeight);

        if (collapsing) {
          const previousScreenOrientation = getScreenOrientation();
          async function waitForExpanding() {
            let maximumWaitTime = false;
            setTimeout(() => {
              maximumWaitTime = true;
            }, 300);

            while (!maximumWaitTime) {
              if (virtualKeyboard.changing === false) {
                if (virtualKeyboard.isOnScreen) {

                } else {
                  getLastVisibleElement(offset);
                  previousCommentsContainerWrapperScrollTop = commentsContainerWrapper.scrollTop;
                  previousCommentsContainerWrapperHeight = commentsContainerWrapper.offsetHeight;
                  previousProjectCommentsModalHeight = projectCommentsModal.offsetHeight;

                  setTimeout(() => {
                    toggleCommentsContainerScrollPosition(
                      false,
                      false,
                      commentsWrapper,
                    );
                    window.removeEventListener('resize', waitForExpanding);

                    if (!acceptsInput(document.activeElement)) {
                      projectCommentsModal.style.height = null;
                      window.removeEventListener('resize', waitForExpanding);
                    }
                  }, 4);
                }

                return;
              }

              await new Promise((resolve) => setTimeout(resolve, 4));
            }
          }
          setTimeout(() => {
            window.addEventListener('resize', waitForExpanding);
          }, 300);

          projectCommentsModal.style.height = `${previousProjectCommentsModalHeight}px`;

          if (previousHeight) {
            if (screenOrientation === 'portrait') {
              finalModalHeight = `${
                window.innerHeight - previousPortraitOrientationKeyboardHeight
              }px`;
            } else {
            }
          } else {
            finalModalHeight = `${window.innerHeight}px`;
          }
        } else {
          projectCommentsModal.style.height = `${previousProjectCommentsModalHeight}px`;
          projectCommentsModal.classList.add('expanding-transitioning');
          if (commentsWrapper.emptySpace.hadHeight) {
            projectCommentsModal.classList.add('space-transition');
          }
          finalModalHeight = `${window.innerHeight}px`;
        }

        if (commentsWrapper.emptySpace.height) {
          commentsWrapper.emptySpace.el.style.height = `${commentsWrapper.emptySpace.height}px`;
          commentsContainer.style.order = '1';
        }

        commentsContainerWrapper.classList.add('transitioning');

        commentsContainerWrapper.scrollTo({
          top: topValue,
        });

        projectCommentsModal.style.height = finalModalHeight;

        projectCommentsModal.classList.add('transitioning');

        projectCommentsModal.addEventListener(
          'transitionend',
          () => {
            projectCommentsModal.classList.remove(
              'transitioning',
              'expanding-transitioning',
              'space-transition',
            );
            commentsContainerWrapper.classList.remove('transitioning');
            (function setCommentsContainerScrollPosition() {
              const topValue = lastVisibleElement.offsetTop
                - (commentsContainerWrapper.offsetHeight
                  - lastVisibleElement.offsetHeight)
                + offset.value;
              commentsContainerWrapper.scrollTo({
                top: topValue,
              });

              commentsWrapper.emptySpace.el.style.height = null;
              commentsContainer.style.order = null;

              if (collapsing) {
                commentsWrapper.emptySpace.el.style.flex = '0 0 0';
              } else {
                projectCommentsModal.style.height = null;
              }
            }());
          },
          { once: true },
        );
      }
    }

    if (
      (screenOrientation === 'portrait'
        && previousPortraitOrientationKeyboardHeight
        && actualHeight === portraitOrientationHighestHeight)
      || (previousLandscapeOrientationKeyboardHeight
        && landscapeOrientationHighestHeight)
    ) {
      if (screenOrientation === 'portrait') {
        toggleCommentsContainerScrollPosition(true, true);
      } else if (window.innerHeight > 58) {
      }
    } else {
      window.addEventListener(
        'resize',
        () => {
          toggleCommentsContainerScrollPosition(true, false, commentsWrapper);
        },
        { once: true },
      );
      setTimeout(() => {
        window.removeEventListener('resize', () => {
          toggleCommentsContainerScrollPosition(true);
        });
      }, 300);
    }
  }

  function checkCommentInputCharacterLimit() {
    const characterLimitElement = this.nextElementSibling;
    const inputLength = this.value.length;
    if (inputLength > 7500 && inputLength < 10000) {
      characterLimitElement.innerHTML = `Character limit: <span class="comment-input-length">${inputLength}</span> / 15000`;
    } else if (inputLength > 10000) {
      characterLimitElement.innerHTML = `Character limit: <span class="comment-input-length five-digits">${inputLength}</span> / 15000`;
    } else {
      characterLimitElement.textContent = '';
    }
  }

  addCommentInput.addEventListener('focusin', () => {
    commentBox.classList.add('focus');
  });

  addCommentInput.addEventListener('focusout', () => {
    commentBox.classList.remove('focus');
  });

  function addCommentToTheDOM(comments, comment, commentsContainer) {
    const { content } = comment;
    const { date } = comment;
    const index = comments.indexOf(comment);
    const commentsNumberValue = comments.length;
    const commentsNumberElement = document.querySelector('.comments-number');
    const projectCommentsNumberElement = document.querySelector(
      '.main-content.enabled .project-comments-content',
    );
    let delay = 0;

    commentsNumberElement.textContent = commentsNumberValue;
    projectCommentsNumberElement.textContent = commentsNumberValue;

    if (commentsContainer.classList.contains('empty')) {
      delay = 200;
      commentsContainer.classList.remove('empty');
      commentsContainer.classList.add('disappear-empty-state');
    }

    setTimeout(() => {
      commentsContainer.classList.remove('disappear-empty-state');
      const commentTemplate = createCommentTemplate(content, date, index);
      let commentElement = createElementFromTemplate(commentTemplate);
      commentsContainer.appendChild(commentElement);

      commentElement = document.querySelector(`.comment[data-index="${index}"`);
      commentElement.classList.add('appearing');

      commentsContainerWrapper.scrollTo({
        top: commentsContainerWrapper.scrollHeight,
        behavior: 'smooth',
      });
    }, delay);
  }

  function addCommentsToTheDOM(comments, commentsContainer) {
    commentsContainer.scrollTo({ top: 0 });

    const previusCommentElements = document.querySelectorAll(
      '.project-comments-modal .comment',
    );
    previusCommentElements.forEach((comment) => {
      comment.remove();
    });

    const commentsDOM = [];

    comments.forEach((comment) => {
      const { content } = comment;
      const { date } = comment;
      const index = comments.indexOf(comment);
      const commentDOMTemplate = createCommentTemplate(content, date, index);
      const commentDOM = createElementFromTemplate(commentDOMTemplate);
      commentsDOM.push(commentDOM);
    });

    commentsDOM.forEach((commentDOM) => {
      commentsContainer.appendChild(commentDOM);
    });

    commentsContainer.scrollTo({
      top: commentsContainer.scrollHeight,
      behavior: 'smooth',
    });

    if (comments.length === 0) {
      commentsContainer.classList.add('empty');
    } else {
      commentsContainer.classList.remove('empty');
    }
  }

  document.addEventListener('click', (event) => {
    if (event.target.matches('.project-comments')) {
      const initializeProjectComments = (() => {
        const projectIndex = parseInt(
          event.target.closest('[data-project]').dataset.project,
        );

        projectCommentsModal.dataset.project = projectIndex;

        const changeProjectCommentsTitle = (() => {
          const projectTitle = toDoProjects.projects[projectIndex].title;
          const projectCommentsTitle = document.querySelector(
            '.project-comments-title',
          );
          projectCommentsTitle.textContent = projectTitle;
        })();

        const changeCommentsNumberValue = (() => {
          const { comments } = toDoProjects.projects[projectIndex];
          let projectCommentsNumberValue = comments.length;
          if (projectCommentsNumberValue === 0) {
            projectCommentsNumberValue = '';
          }
          const projectCommentsNumber = document.querySelector('.comments-number');
          projectCommentsNumber.textContent = projectCommentsNumberValue;
        })();

        const changeProjectHeaderIcon = (() => {
          const projectCommentsHeaderIcon = document.querySelector(
            '.project-comments-header-icon',
          );

          const projectInboxIconTemplate = '<svg class="project-home-icon" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="nonzero"><path d="M10 14.5a2 2 0 104 0h5.5V18a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18v-3.5H10z" opacity="0.1"></path><path d="M8.062 4h7.876a2 2 0 011.94 1.515l2.062 8.246a2 2 0 01.06.485V18a2 2 0 01-2 2H6a2 2 0 01-2-2v-3.754a2 2 0 01.06-.485l2.06-8.246A2 2 0 018.061 4zm0 1a1 1 0 00-.97.757L5.03 14.004a1 1 0 00-.03.242V18a1 1 0 001 1h12a1 1 0 001-1v-3.754a1 1 0 00-.03-.242l-2.06-8.247A1 1 0 0015.94 5H8.061zM12 17.25A2.75 2.75 0 019.295 15H7a.5.5 0 110-1h2.75a.5.5 0 01.5.5 1.75 1.75 0 003.5 0 .5.5 0 01.5-.5H17a.5.5 0 110 1h-2.295A2.75 2.75 0 0112 17.25z"></path></g></svg>';

          let color;

          if (projectIndex > 0) {
            color = toDoProjects.projects[projectIndex].color;
          }

          const projectIconTemplate = `<span class="circle ${color}"></span>`;

          if (projectIndex === 0) {
            projectCommentsHeaderIcon.innerHTML = projectInboxIconTemplate;
          } else {
            projectCommentsHeaderIcon.innerHTML = projectIconTemplate;
          }
        })();

        const resetCommentInput = (() => {
          const addCommentInput = document.querySelector('.comment-text');
          addCommentInput.value = '';
          changeTextareaHeightOnInput.call(addCommentInput);
          checkCommentInputCharacterLimit.call(addCommentInput);
        })();

        const { comments } = toDoProjects.projects[projectIndex];
        const commentsContainer = document.querySelector('.comments-container');
        addCommentsToTheDOM(comments, commentsContainer);
        commentsContainerWrapper.scrollTo({
          top: commentsContainerWrapper.scrollHeight,
        });
      })();
    }
  });

  const closeProjectComments = document.querySelector(
    '.close-project-comments',
  );

  const commentActionButton = document.querySelector('.comment-action');

  commentActionButton.addEventListener('click', addComment, false);

  function addComment() {
    const addCommentInput = document.querySelector(
      '.project-comments-modal .comment-text',
    );
    const commentText = addCommentInput.value;
    const projectIndex = +this.closest('[data-project]').dataset.project;
    commentActionButton.classList.add('clicked');
    setTimeout(() => {
      commentActionButton.classList.remove('clicked');
    }, 500);

    if (!/\S/.test(commentText) === false) {
      let comment;
      let comments;
      const commentsContainer = document.querySelector('.comments-container');

      const addComment = (() => {
        comment = projectCreate.newComment(commentText);
        comments = toDoProjects.projects[projectIndex].comments;
        comments.push(comment);
        saveToDoProjects();
      })();

      addCommentToTheDOM(comments, comment, commentsContainer);
      addCommentInput.value = '';
      changeTextareaHeightOnInput.call(addCommentInput);
      checkCommentInputCharacterLimit.call(addCommentInput);
    }
  }

  document.addEventListener('click', (event) => {
    if (event.target.matches('.edit-comment')) {
      const editCommentButton = event.target;
      const commentContent = editCommentButton.closest('.comment-content');
      const commentDescription = commentContent.querySelector(
        '.comment-description',
      );
      const comment = commentDescription.textContent;

      const removePreviousEditCommentContainer = (() => {
        if (document.querySelector('.edit-comment-container')) {
          const editCommentContainer = document.querySelector(
            '.edit-comment-container',
          );
          const commentContent = editCommentContainer.closest('.comment-content');
          editCommentContainer.remove();
          commentContent.classList.remove('edit');
        }
      })();

      commentContent.classList.add('edit');

      const addEditCommentBoxToTheDOM = (() => {
        const editCommentContainerTemplate = createEditCommentContainerTemplate(comment);
        commentContent.insertAdjacentHTML(
          'beforeend',
          editCommentContainerTemplate,
        );

        const editCommentBox = document.querySelector('.edit-comment-box');
        editCommentBox.value = comment;
        editCommentBox.addEventListener(
          'input',
          changeTextareaHeightOnInput,
          false,
        );
        changeTextareaHeightOnInput.call(editCommentBox);

        function enableUpdateCommentButton(event) {
          const updateCommentButton = document.querySelector('.update-comment');
          if (!/\S/.test(event.target.value)) {
            updateCommentButton.classList.add('disabled');
          } else {
            updateCommentButton.classList.remove('disabled');
          }
        }

        editCommentBox.addEventListener('input', enableUpdateCommentButton);
        editCommentBox.addEventListener(
          'input',
          checkCommentInputCharacterLimit,
          false,
        );
      })();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.matches('.update-comment:not(.disabled)')) {
      const updateCommentButton = event.target;
      const projectIndex = parseInt(
        updateCommentButton.closest('[data-project]').dataset.project,
      );
      const commentIndex = parseInt(
        updateCommentButton.closest('.comment').dataset.index,
      );
      const editCommentBox = document.querySelector('.edit-comment-box');
      const comment = editCommentBox.value;

      const updateComment = (() => {
        toDoProjects.projects[projectIndex].comments[commentIndex].content = comment;

        saveToDoProjects();
      })();

      const updateCommentElement = (() => {
        const editCommentContainer = document.querySelector(
          '.edit-comment-container',
        );

        const commentContent = updateCommentButton.closest('.comment-content');
        const commentDescription = commentContent.querySelector(
          '.comment-description',
        );

        editCommentContainer.remove();
        commentDescription.textContent = comment;

        commentContent.classList.remove('edit');
      })();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.matches('.cancel-edit-comment')) {
      const commentContent = event.target.closest('.comment-content');
      const editCommentContainer = document.querySelector(
        '.edit-comment-container',
      );

      editCommentContainer.remove();
      commentContent.classList.remove('edit');
    }
  });

  const closeProjectCommentsButton = document.querySelector(
    '.close-project-comments',
  );
  closeProjectCommentsButton.addEventListener('click', closeModals);
})();
