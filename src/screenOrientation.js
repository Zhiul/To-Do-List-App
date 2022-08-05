export let screenOrientation;
export let previousScreenOrientation;

export function getScreenOrientation() {
  let orientation;

  if (screen.orientation) {
    if (
      screen.orientation.type === 'portrait-secondary'
        || screen.orientation.type === 'portrait-primary'
    ) {
      orientation = 'portrait';
    } else {
      orientation = 'landscape';
    }
  } else if (window.orientation == 0 || 180) {
    orientation = 'portrait';
  } else {
    orientation = 'landscape';
  }

  return orientation;
}

export function setScreenOrientationValues() {
  previousScreenOrientation = screenOrientation;
  screenOrientation = getScreenOrientation();
}
