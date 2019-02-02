/*
 * Generate SVG path description for symmetric arcs.
 *
 * @param   {Number}    centerX     X coordinate of center
 * @param   {Number}    centerY     Y coordinate of center
 * @param   {Number}    radius      Radius of arc from center
 * @param   {Number}    startAngle  Angle relative to center, at which the arc starts
 * @param   {Number}    endAngle    Angle relative to center, at which the arc ends
 * @param   {Boolean}   noMoveTo    Don't prepend a 'move to' fragment to the path description, if true
 *
 * @return  {String}                Arc description
 */

import polar2Cartesian from './polar2Cartesian';

const describeArc = (centerX, centerY, radius, startAngle, endAngle, noMoveTo = false) => {
  const start = polar2Cartesian(centerX, centerY, radius, endAngle);
  const end = polar2Cartesian(centerX, centerY, radius, startAngle);
  const rotation = 0; // don't rotate
  const largeArc = 0; // always draw a short arc
  const angelDiff = endAngle - startAngle;
  const sweep = angelDiff >= 0 && angelDiff <= 180 ? '0' : '1'; // make arc sweep into right direction
  const d = [
    'M',
    start.x,
    start.y, // move to start point
    'A',
    radius,
    radius,
    rotation,
    largeArc,
    sweep,
    end.x,
    end.y, // draw arc
  ];

  if (noMoveTo) {
    // draw the arc only, don't move to a start point first
    d = ['A', radius, radius, rotation, largeArc, sweep, end.x, end.y];
  }

  return d.join(' ');
};

export default describeArc;
