/*
 * Get Cartesian coordinates of a point at a given angle and radius from the center.
 *
 * @param   {Number]}   angle   Angle of point relative to center
 * @param   {Number}    radius  Radius of point from center
 * @param   {Object}    center  X and y coordinates of center
 *
 * @return  {Object}            X and y coordinates of point
 */

import perc2Abs from './perc2Abs';
import polar2Cartesian from './polar2Cartesian';

const cartesianCenter = (angle, radius, center = {}, absMiddle) =>
  polar2Cartesian(center.x || absMiddle, center.y || absMiddle, perc2Abs(radius + '%'), angle);

export default cartesianCenter;
