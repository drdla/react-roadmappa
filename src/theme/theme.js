/*
 * Global variables.
 */

/* tslint:disable object-literal-sort-keys */

import {color} from '../lib';

const {darken, desaturate, lighten, saturate, transparentize} = color;

const transitionTimeMultiplier = 1; // scaling factor for development / debugging

// Base values for deriving variations
const borderRadius = 3;
const borderWidth = 1;

const size = 14;

const colorPrimary = 'hsl(100, 46%, 55%)';
const colorSecondary = 'hsl(248, 67%, 64%)';
const colorClickable = 'hsl(207, 67%, 64%)';
const colorText = 'hsl(201, 13%, 18%)';
const colorBackground = 'hsl(195, 2%, 89%)';
const colorBorder = 'hsl(195, 8%, 76%)';
const white = '#fff';

// Darker color variations:
// - Brightness
// + Saturation
// Hue (often) shifts towards a luminosity minimum (red, green, or blue)
// Lighter color variations:
// + Brightness
// - Saturation
// Hue (often) shifts towards a luminosity maximum
const theme = {
  color: {
    primary: {
      default: colorPrimary,
      darker: darken(saturate(colorPrimary, 1), 9),
      darkest: darken(saturate(colorPrimary, 2), 13),
      lighter: lighten(desaturate(colorPrimary, 8), 13),
      lightest: lighten(desaturate(colorPrimary, 13), 34),
    },
    secondary: {
      default: colorSecondary,
      darker: darken(saturate(colorSecondary, 1), 5),
      darkest: darken(saturate(colorSecondary, 2), 8),
      lighter: lighten(desaturate(colorSecondary, 8), 13),
      lightest: lighten(desaturate(colorSecondary, 13), 34),
    },
    clickable: {
      // colors for clickable items (links, buttons, etc.)
      default: colorClickable,
      highlight: lighten(saturate(colorClickable, 3), 8),
      darker: darken(saturate(colorClickable, 3), 13),
    },
    text: {
      default: colorText,
      lighter: lighten(desaturate(colorText, 5), 46),
      lightest: lighten(desaturate(colorText, 5), 69),
      inverse: white,
    },
    background: {
      default: colorBackground,
      darker: darken(saturate(colorBackground, 3), 21),
      darkest: darken(saturate(colorBackground, 4), 61),
      offBlack: darken(colorBackground, 79),
      lighter: lighten(colorBackground, 2),
      lightest: lighten(desaturate(colorBackground, 1), 5),
      offWhite: lighten(desaturate(colorBackground, 8), 8),
      white,
      overlay: transparentize(darken(saturate(colorBackground, 11), 92), 13),
      clickable: transparentize(lighten(saturate(colorClickable, 3), 8), 72), // clickable.highlight transparentized
    },
    border: {
      default: colorBorder,
      darker: darken(desaturate(colorBorder, 3), 16),
      lighter: lighten(colorBorder, 8),
      lightest: lighten(colorBorder, 13),
      white,
    },
    inherit: 'inherit',
    state: {
      attention: 'hsl(50, 89%, 62%)',
      danger: 'hsl(1, 76%, 58%)',
      error: 'hsl(1, 76%, 58%)',
      info: 'hsl(200, 100%, 74%)',
      success: 'hsl(102, 69%, 59%)',
    },
    transparent: 'transparent',
  },
  border: {
    radius: {
      default: `${borderRadius}px`,
      tiny: `${borderRadius - 2}px`,
      small: `${borderRadius - 1}px`,
      large: `${borderRadius * 2}px`,
      huge: `${borderRadius * 3}px`,
      circle: '50%',
      pill: '999px',
    },
    width: {
      default: `${borderWidth}px`,
      strong: `${borderWidth * 2}px`,
      superStrong: `${borderWidth * 4}px`,
    },
  },
  boxShadow: {
    default: '1px 1px 6px 0.5px rgba(0, 0, 0, 0.21)',
    separateFromBelow: '0 1px 3px rgba(0, 0, 0, 0.21)',
  },
  font: {
    size: {
      default: `${size}px`,
      tiny: '0.714rem',
      small: '0.857rem',
      large: '1.5rem',
      huge: '2rem',
      pageTitle: '3rem',
    },
    weight: {
      normal: 400,
      bold: 600,
    },
  },
  size: {
    default: `${size}px`,
    tiny: `${size / 4}px`,
    small: `${size / 2}px`,
    large: `${size * 2}px`,
    huge: `${size * 4}px`,
    inherit: 'inherit',
  },
  transition: {
    style: {
      default: 'ease-in-out',
      dynamic: 'cubic-bezier(0.73, 0.01, 0, 1)',
      easeInOut: 'ease-in-out',
    },
    time: {
      veryFast: `${75 * transitionTimeMultiplier}ms`,
      fast: `${150 * transitionTimeMultiplier}ms`,
      medium: `${250 * transitionTimeMultiplier}ms`,
      slow: `${400 * transitionTimeMultiplier}ms`,
      verySlow: `${1000 * transitionTimeMultiplier}ms`,
    },
  },
  zIndex: {
    recessed: -1,
    base: 0,
    // elements on the base layer that need to stick out
    elevated1: 10,
    elevated2: 11,
    elevated3: 12,
    // elements that float over the base layer
    overlayed1: 100,
    overlayed2: 110,
    overlayed3: 120,
    // elements that must never be covered
    topmost1: 1000000,
    topmost2: 1000010,
    topmost3: 1000020,
  },
};

export default theme;
