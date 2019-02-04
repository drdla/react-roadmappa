/*
 * Get radius values for a given number of intervals to be rendered in the roadmap diagram.
 *
 * @param   {Number}    numberOfIntervals   Number of intervals to be rendered in the roadmap diagram
 *
 * @return  {Object}                        Percent values for outer, inner, and center radius of every interval
 */

import {diagramRadii} from '../constants';

const getIntervalRadii = numberOfIntervals => {
  const step = (diagramRadii.segmentMax - diagramRadii.segmentMin) / numberOfIntervals;
  const radii = [];

  for (let i = 0; i < numberOfIntervals; i++) {
    radii.push({
      inner: diagramRadii.segmentMin + i * step,
      center: diagramRadii.segmentMin + (i + 0.5) * step,
      outer: diagramRadii.segmentMin + (i + 1) * step,
    });
  }

  return radii;
};

export default getIntervalRadii;
