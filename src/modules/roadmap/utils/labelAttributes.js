/*
 * Calculate position and alignment of label for a feature.
 *
 * @param   {Number}    featureAngle    Angle of the feature relative to the diagram center
 * @param   {Number}    featureRadius   Radius of the feature from the diagram center
 *
 * @return  {Object}                    X and y coordinates and text alignment
 */

import fineTuneLabelSpacing from './fineTuneLabelSpacing';
import cartesianCenter from './cartesianCenter';

const labelAttributes = (featureAngle, featureRadius) => {
  let textAnchor = 'middle';
  let spacing = 2; // default spacing

  // adjust text-alignment depending on featureAngle
  if (featureAngle > 45 && featureAngle < 135) {
    spacing = 1;

    // left-align text on the right side of the diagram
    textAnchor = 'start';
  } else if (featureAngle > 225 && featureAngle < 315) {
    spacing = 1;

    // right-align text on the left side of the diagram
    textAnchor = 'end';
  }

  spacing += fineTuneLabelSpacing(featureAngle) * 0.5;

  // increase radius to add space between dot and label
  const {x, y} = cartesianCenter(featureAngle, featureRadius + spacing);

  return {
    textAnchor,
    x,
    y,
  };
};

export default labelAttributes;
