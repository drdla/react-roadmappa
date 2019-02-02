const specialKeys = {
  alt: 18,
  arrowDown: 40,
  arrowLeft: 37,
  arrowRight: 39,
  arrowUp: 38,
  cmd: 91,
  cmd2: 93,
  ctrl: 17,
  delete: 8,
  enter: 13,
  escape: 27,
  shift: 16,
  tab: 9,
};

export const key = e => {
  const code = e.keyCode;
  const char = String.fromCharCode(code);

  return {
    char,
    code,
  };
};

const compareTo = (e, name) => e.keyCode === specialKeys[name];

export const isArrowDown = e => compareTo(e, 'arrowDown');
export const isArrowUp = e => compareTo(e, 'arrowUp');
export const isEnter = e => compareTo(e, 'enter');
export const isEsc = e => compareTo(e, 'escape');
export const isShift = e => compareTo(e, 'shift');
export const isTab = e => compareTo(e, 'tab');

// prevent the key press, if it's not a number
export const preventNonNumbers = e =>
  (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105);

export const allowSpecialKeys = e =>
  // allow backspace, delete, tab, escape, enter, ',', and '.'
  [46, 8, 9, 27, 13, 110, 188, 190].includes(e.keyCode) ||
  // allow Ctrl + A / C / V / X (Windows)
  (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) ||
  // allow Cmd + A / C / V / X (Mac)
  (e.metaKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) ||
  // allow home, end, left, right
  (e.keyCode >= 35 && e.keyCode <= 39);
