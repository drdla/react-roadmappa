/*
 * Convert absolute sizes to relative sizes, based on the container width.
 *
 * @param   {Number}    valueInPx   Absolute value in pixels
 *
 * @return  {String}                Relative value in percent, e.g. '5.3%'
 */

const abs2Perc = (valueInPx, placeholderWidth) => `${valueInPx / placeholderWidth}%`;

export default abs2Perc;
