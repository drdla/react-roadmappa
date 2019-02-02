/*
 * Get absolute coordinates of a point at a given angle and radius from the center.
 *
 * @param   {num}   centerX         Center x coordinate
 * @param   {num}   centerY         Center y coordinate
 * @param   {num}   radius          Radius from the center
 * @param   {num}   angleInDegrees  Angle from the center
 *
 * @return  {Object}                Object with Cartesian x and y coordinates
 */

const polar2Cartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

export default polar2Cartesian;
