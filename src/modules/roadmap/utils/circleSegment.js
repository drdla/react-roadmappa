/*
 * Draw circle segments.
 *
 * @param   {Number}    centerX     X coordinate of center
 * @param   {Number}    centerY     Y coordinate of center
 * @param   {String}    outerRadius Outer radius of circle segment from center in percent, e.g. '10%'
 * @param   {String}    innerRadius Inner radius of circle segment from center in percent, e.g. '5%'
 * @param   {Number}    startAngle  Angle in degrees relative to center at which the circle segment starts
 * @param   {Number}    endAngle    Angle in degrees relative to center at which the circle segment ends
 *
 * @return  {Object}                SVG path element
 */

import describeArc from './describeArc';
import polar2Cartesian from './polar2Cartesian';

const circleSegment = (centerX, centerY, outerRadius, innerRadius, startAngle, endAngle, path) => {
  const outerArc = describeArc(centerX, centerY, outerRadius, startAngle, endAngle);
  const startInnerArc = polar2Cartesian(centerX, centerY, innerRadius, startAngle);
  const lineOuter2Inner = ['L', startInnerArc.x, startInnerArc.y].join(' ');
  const innerArc = describeArc(centerX, centerY, innerRadius, endAngle, startAngle, true);
  const closePath = 'Z';

  // join path fragments
  const circleSegmentPath = [outerArc, lineOuter2Inner, innerArc, closePath].join(' ');

  return path(circleSegmentPath);
};

export default circleSegment;
