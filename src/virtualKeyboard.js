import { getScreenOrientation, setScreenOrientationValues } from './screenOrientation';

// function getScreenAspectRatioInPortraitMode() {
//   return parseFloat((window.innerHeight / window.innerWidth).toString().slice(0, 4));
// }

// function getScreenAspectRatioInLandscapeMode() {
//   return parseFloat((window.innerWidth / window.innerHeight).toString().slice(0, 4));
// }

setTimeout(() => {
  window.virtualKeyboard = virtualKeyboard;
}, 400);

const _ = require('lodash');

const root = document.documentElement;
let totalViewportHeightWithoutVK;
let changeOrientation;

root.style.setProperty(
  '--totalViewportHeightWithoutVK',
  `${window.innerHeight}px`,
);

function setTotalViewportHeightWithoutVK() {
  if (screenOrientation === 'portrait') {
    totalViewportHeightWithoutVK = `${previousPortraitWindowHeightWithoutVK}px`;
    root.style.setProperty(
      '--totalViewportHeightWithoutVK',
      totalViewportHeightWithoutVK,
    );
  } else {
    totalViewportHeightWithoutVK = `${previousLandscapeWindowHeightWithoutVK}px`;
    root.style.setProperty(
      '--totalViewportHeightWithoutVK',
      totalViewportHeightWithoutVK,
    );
  }
}

export const acceptsInput = (elem) => {
  if (!elem) {
    return false;
  }

  const tag = elem.tagName;
  return (
    tag == 'INPUT'
    || tag == 'SELECT'
    || tag == 'TEXTAREA'
    || elem.isContentEditable
    || elem.classList.contains('input')
    || elem.classList.contains('input-submit')
  );
};

// Update values to check if Virtual Keyboard is on screen.

let changeWindowHeightAfterFocusIn = false;
let screenOrientationAfterFocusIn;

// Prevents closing Virtual Keyboard when touching the screen

document.addEventListener('touchend', (e) => {
  const { target } = e;
  const dontDiscardKeyboard = target.closest('.keep-keyboard');

  if (dontDiscardKeyboard) {
    if (e.cancelable) {
      if (!acceptsInput(target)) {
        if (virtualKeyboard.isOnScreen) {
          e.preventDefault();
          target.click();
        }
      }
    }
  } else if (!acceptsInput(target)) {
    document.activeElement.blur();
  }
});

function detectChangeOrientation() {
  changeOrientation = screenOrientationAfterFocusIn !== screenOrientation;
  if (screenOrientation === previousScreenOrientation) {
    screenOrientationAfterFocusIn = screenOrientation;
  }
}

window.addEventListener('resize', setScreenOrientationValues);
window.addEventListener('resize', _.throttle(detectChangeOrientation), 300);

let setWindowHeightsInstances = 0;

function setWindowHeightsValues() {
  setWindowHeightsInstances += 1;

  previousWindowHeight = actualWindowHeight;
  actualWindowHeight = window.innerHeight;

  let highestWindowHeight;

  if (screenOrientation === 'portrait') {
    if (actualWindowHeight > portraitOrientationHighestWindowHeight) {
      portraitOrientationHighestWindowHeight = actualWindowHeight;
    }
    highestWindowHeight = portraitOrientationHighestWindowHeight;
  } else {
    if (actualWindowHeight > highestWindowHeight) {
      landscapeOrientationHighestWindowHeight = actualWindowHeight;
    }
    highestWindowHeight = landscapeOrientationHighestWindowHeight;
  }

  if (actualWindowHeight < highestWindowHeight) {
    lowWindowHeight = actualWindowHeight;
  }

  function setPreviousOrientationWindowHeightWithoutVK() {
    if ((actualWindowHeight === previousPortraitWindowHeightWithoutVK) || (actualWindowHeight === previousLandscapeWindowHeightWithoutVK)) return;

    if (screenOrientation === 'portrait') {
      const savedClosestPortraitWindowHeightWithoutVK = virtualKeyboard.portraitWindowHeightsWithoutVK.find(
        (height) => height >= actualWindowHeight && height < actualWindowHeight + 40,
      );

      if (savedClosestPortraitWindowHeightWithoutVK) {
        previousPortraitWindowHeightWithoutVK = savedClosestPortraitWindowHeightWithoutVK;
      } else {
        previousPortraitWindowHeightWithoutVK = actualWindowHeight < previousPortraitWindowHeightWithoutVK
          ? previousPortraitWindowHeightWithoutVK
          : actualWindowHeight + 32;
      }
    } else {
      previousLandscapeWindowHeightWithoutVK = actualWindowHeight < previousLandscapeWindowHeightWithoutVK
        ? previousLandscapeWindowHeightWithoutVK
        : actualWindowHeight;
    }
  }

  setTimeout(() => {
    if (virtualKeyboard.changing) {
      (async function waitForVirtualKeyboardStatus() {
        while (true) {
          if (virtualKeyboard.isOnScreen === false) {
            setPreviousOrientationWindowHeightWithoutVK();
            setTotalViewportHeightWithoutVK();
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 4));
        }
      }());
    }
    // else if (virtualKeyboard.changing && changeOrientation) {
    //   setPreviousOrientationWindowHeightWithoutVK();
    //   setTotalViewportHeightWithoutVK();
    // } else {
    //   setTotalViewportHeightWithoutVK();
    // }

    setWindowHeightsInstances -= 1;

    if (setWindowHeightsInstances > 0) return;
  }, 4);
}

export const virtualKeyboard = (() => {
  const isOnScreen = false;
  const changing = false;
  const height = undefined;
  const windowHeights = [];
  const windowHeightsWithoutVK = [];
  const portraitWindowHeightsWithoutVK = [];
  const landscapeWindowHeightsWithoutVK = [];
  // const aspectRatiosWithoutVK = [];

  const totalWindowHeight = () => window.innerHeight + virtualKeyboard.height;
  const windowHeightMatches = () => virtualKeyboard.windowHeights.includes(actualWindowHeight);
  const windowHeightWithoutVKMatches = () => virtualKeyboard.windowHeightsWithoutVK.includes(actualWindowHeight);

  return {
    isOnScreen,
    changing,
    height,
    windowHeights,
    windowHeightsWithoutVK,
    portraitWindowHeightsWithoutVK,
    landscapeWindowHeightsWithoutVK,
    // aspectRatiosWithoutVK,
    totalWindowHeight,
    windowHeightMatches,
    windowHeightWithoutVKMatches,
  };
})();

window.addEventListener('resize', setWindowHeightsValues);

export let screenOrientation = getScreenOrientation();
let previousScreenOrientation;
export let portraitOrientationHighestWindowHeight = screenOrientation === 'portrait' ? window.innerHeight : null;
export let landscapeOrientationHighestWindowHeight = screenOrientation === 'landscape' ? window.innerHeigh : null;
export let actualWindowHeight = window.innerHeight;
export let previousWindowHeight = window.innerHeight;
let previousPortraitWindowHeightWithoutVK = screenOrientation === 'portrait' ? window.innerHeight : null;

if (previousPortraitWindowHeightWithoutVK) {
  virtualKeyboard.portraitWindowHeightsWithoutVK.push(
    previousPortraitWindowHeightWithoutVK,
  );

  // const aspectRatio = getScreenAspectRatioInPortraitMode();
  // virtualKeyboard.aspectRatiosWithoutVK.push(aspectRatio);
}

let previousLandscapeWindowHeightWithoutVK = screenOrientation === 'landscape' ? window.innerHeight : null;
if (previousLandscapeWindowHeightWithoutVK) {
  virtualKeyboard.landscapeWindowHeightsWithoutVK.push(
    previousLandscapeWindowHeightWithoutVK,
  );

  // const aspectRatio = getScreenAspectRatioInLandscapeMode();
  // virtualKeyboard.aspectRatiosWithoutVK.push(aspectRatio);
}
let lowWindowHeight;

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.addEventListener('geometrychange', () => {
    if (navigator.virtualKeyboard.boundingRect.height > 0) {
      virtualKeyboard.isOnScreen = true;
      if (
        virtualKeyboard.windowHeights.includes(actualWindowHeight) === false
      ) {
        virtualKeyboard.windowHeights.push(actualWindowHeight);
      }
    } else {
      virtualKeyboard.isOnScreen = false;
    }
  });

  navigator.virtualKeyboard.addEventListener('geometrychange', () => {
    if (navigator.virtualKeyboard.boundingRect.height > 0) {
      if (
        virtualKeyboard.windowHeights.includes(actualWindowHeight) === false
      ) {
        virtualKeyboard.windowHeights.push(actualWindowHeight);
      }

      root.style.setProperty(
        '--actualKeyboardHeight',
        `${navigator.virtualKeyboard.boundingRect.height}px`,
      );
      root.style.setProperty(
        '--lastKeyboardHeight',
        `${navigator.virtualKeyboard.boundingRect.height}px`,
      );
    } else {
      root.style.setProperty('--actualKeyboardHeight', '0px');

      if (
        virtualKeyboard.windowHeightsWithoutVK.includes(actualWindowHeight)
        === false
      ) {
        virtualKeyboard.windowHeightsWithoutVK.push(actualWindowHeight);

        if (screenOrientation === 'portrait') {
          virtualKeyboard.portraitWindowHeightsWithoutVK.push(
            actualWindowHeight,
          );
        } else {
          virtualKeyboard.landscapeWindowHeightsWithoutVK.push(
            actualWindowHeight,
          );
        }
      }
    }
  });
} else {
  function setChangeWindowHeightAfterFocusIn() {
    changeWindowHeightAfterFocusIn = true;

    setTimeout(() => {
      changeWindowHeightAfterFocusIn = false;
    }, 150);
  }

  function checkIfChangeWindowHeightAfterFocusIn() {
    window.addEventListener('resize', setChangeWindowHeightAfterFocusIn);

    setTimeout(() => {
      window.removeEventListener('resize', setChangeWindowHeightAfterFocusIn);
    }, 150);
  }

  function updateScreenOrientationAfterFocusIn() {
    screenOrientationAfterFocusIn = getScreenOrientation();
  }

  function updateValuesIfFocusOnInput() {
    const target = document.activeElement;
    if (acceptsInput(target)) {
      checkIfChangeWindowHeightAfterFocusIn();
      updateScreenOrientationAfterFocusIn();
    }
  }

  window.addEventListener('focus', updateValuesIfFocusOnInput, true);

  document.addEventListener('touchend', (e) => {
    const { target } = e;

    if (acceptsInput(target)) {
      checkIfChangeWindowHeightAfterFocusIn();
      updateScreenOrientationAfterFocusIn();
    }
  });

  function determineIfKeyboardIsOnScreen() {
    return new Promise((finished) => {
      const inputFocus = document.querySelectorAll('input:focus, textarea:focus').length > 0;

      if (inputFocus) {
        let maximumWaitTime = false;

        function determineIfKeyboardIsOnScreen() {
          if (
            !virtualKeyboard.windowHeightWithoutVKMatches()
            && (virtualKeyboard.windowHeightMatches()
              || (virtualKeyboard.isOnScreen && changeOrientation)
              || (virtualKeyboard.isOnScreen
                && actualWindowHeight - previousWindowHeight <= 170)
              || (actualWindowHeight === lowWindowHeight
                && changeWindowHeightAfterFocusIn
                && !changeOrientation)
              || (actualWindowHeight < previousWindowHeight
                && changeWindowHeightAfterFocusIn
                && !changeOrientation))
          ) {
            virtualKeyboard.isOnScreen = true;
            finished();
          } else {
            virtualKeyboard.isOnScreen = false;
            finished();
          }
        }

        async function waitForChangeWindowHeightAfterFocusIn() {
          while (true) {
            if (
              (changeWindowHeightAfterFocusIn
              || actualWindowHeight > previousWindowHeight
              || virtualKeyboard.windowHeightMatches()
              || virtualKeyboard.windowHeightWithoutVKMatches())
              && !maximumWaitTime
            ) {
              determineIfKeyboardIsOnScreen();
              return;
            } if (maximumWaitTime) {
              return;
            }
            await new Promise((resolve) => setTimeout(resolve, 4));
          }
        }
        waitForChangeWindowHeightAfterFocusIn();
        setTimeout(() => (maximumWaitTime = true), 150);
      } else {
        finished();
        virtualKeyboard.isOnScreen = false;
      }
    });
  }

  // function updateAspectRatiosWithoutVKWhileVKIsOn(){
  //   if (virtualKeyboard.isOnScreen) {
  //     if (screenOrientation === 'portrait') {
  //       if (!previousPortraitWindowHeightWithoutVK) {
  //         const actualAspectRatio = getScreenAspectRatioInPortraitMode();
  //         virtualKeyboard.aspectRatiosWithoutVK.push(actualAspectRatio);
  //       }
  //     } else {
  //       if (!previousLandscapeWindowHeightWithoutVK) {
  //         const actualAspectRatio = getScreenAspectRatioInLandscapeMode();
  //         virtualKeyboard.aspectRatiosWithoutVK.push(actualAspectRatio);
  //       }
  //     }
  //   }
  // }

  function updateKeyboardValues() {
    if (updateVirtualKeyboardInstances > 1) return;

    if (virtualKeyboard.isOnScreen) {
      if (screenOrientation === 'portrait') {
        virtualKeyboard.height = previousPortraitWindowHeightWithoutVK - window.innerHeight;
      } else {
        virtualKeyboard.height = previousLandscapeWindowHeightWithoutVK - window.innerHeight;
      }

      const virtualKeyboardHeight = `${virtualKeyboard.height}px`;

      root.style.setProperty('--actualKeyboardHeight', virtualKeyboardHeight);
      root.style.setProperty('--lastKeyboardHeight', virtualKeyboardHeight);

      if (
        virtualKeyboard.windowHeights.includes(actualWindowHeight) === false
      ) {
        virtualKeyboard.windowHeights.push(actualWindowHeight);
      }
    } else {
      root.style.setProperty('--actualKeyboardHeight', '0px');

      if (screenOrientation === 'portrait') {
        if (
          virtualKeyboard.windowHeightsWithoutVK.includes(
            previousPortraitWindowHeightWithoutVK,
          ) === false
        ) {
          virtualKeyboard.windowHeightsWithoutVK.push(
            previousPortraitWindowHeightWithoutVK,
          );
          virtualKeyboard.portraitWindowHeightsWithoutVK.push(
            previousPortraitWindowHeightWithoutVK,
          );
        }
      } else if (
        virtualKeyboard.windowHeightsWithoutVK.includes(
          previousLandscapeWindowHeightWithoutVK,
        ) === false
      ) {
        virtualKeyboard.windowHeightsWithoutVK.push(
          previousLandscapeWindowHeightWithoutVK,
        );
        virtualKeyboard.portraitWindowHeightsWithoutVK.push(
          previousLandscapeWindowHeightWithoutVK,
        );
      }
    }
  }

  let updateVirtualKeyboardInstances = 0;

  function updateVirtualKeyboard() {
    virtualKeyboard.changing = true;
    updateVirtualKeyboardInstances += 1;

    determineIfKeyboardIsOnScreen()
      .then(updateKeyboardValues)
      .then(() => {
        updateVirtualKeyboardInstances -= 1;
        if (updateVirtualKeyboardInstances === 0) {
          virtualKeyboard.changing = false;
        }
      });
  }

  window.addEventListener('resize', updateVirtualKeyboard);
}
