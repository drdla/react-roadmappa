/*
 * Color Schemes
 */

const orange = 'hsl(30, 92%, 54%)';
const yellow = 'hsl(45, 88%, 60%)';
const green = 'hsl(152, 100%, 35%)';
const blue = 'hsl(208, 57%, 54%)';
const purple = 'hsl(293, 31%, 48%)';
const red = 'hsl(356, 84%, 62%)';
const gray = 'hsl(0, 0%, 80%)';

const colors = [
  [orange],
  [orange, yellow],
  [orange, yellow, green],
  [orange, yellow, green, blue],
  [orange, yellow, green, blue, purple],
  [orange, yellow, green, blue, purple, red],
  [orange, yellow, green, blue, purple, red, gray],
];

const sectionColor = (section, sections, attribute = 'color') => `${attribute}: ${colors[sections - 1][section]};`;

export default sectionColor;
