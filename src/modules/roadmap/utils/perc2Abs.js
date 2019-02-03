/*
 * Convert relative sizes to absolute sizes, based on the container width.
 *
 * @param   {String}    valueInPercent  Percentage value as string, e.g. '10%'
 *
 * @return  {Number}                    Absolute value in pixels
 */

const perc2Abs = (valueInPercent, size) => (parseInt(valueInPercent.toString().replace('%', ''), 10) / 100) * size;

export default perc2Abs;
