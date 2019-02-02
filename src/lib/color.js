/*
 * All color functions take amounts between 0 and 100 as argument
 */

import {
  darken as darkenPolished,
  desaturate as desaturatePolished,
  lighten as lightenPolished,
  saturate as saturatePolished,
  transparentize as transparentizePolished,
} from 'polished';

export const lighten = (color, amount) => lightenPolished(amount / 100, color);

export const darken = (color, amount) => darkenPolished(amount / 100, color);

export const saturate = (color, amount) => saturatePolished(amount / 100, color);

export const desaturate = (color, amount) => desaturatePolished(amount / 100, color);

export const transparentize = (color, amount) => transparentizePolished(amount / 100, color);
