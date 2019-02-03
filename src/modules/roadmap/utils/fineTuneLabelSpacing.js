/*
 * Adjust the position of a feature label relative to its feature dot, depending on their diagram position.
 *
 * @param   {Number}    angleInDegrees  Angle at which the feature is rendered in the circular roadmap
 *
 * @return  {Number}                    Additional spacing in pixels
 */

const fineTuneLabelSpacing = angleInDegrees =>
  Math.abs(
    // maximum shift for multiples of 45°, minimum shift for multiples of 0° / 90°
    Math.sin((((angleInDegrees * 2) % 180) / 180) * Math.PI)
  );

export default fineTuneLabelSpacing;
