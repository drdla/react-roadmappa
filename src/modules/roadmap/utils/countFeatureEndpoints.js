/*
 * Recursively count the number of features without dependent features (end points) in a feature data object.
 *
 * @param   {Object|Array}  object  Object with feature data
 *
 * @return  {Number}                Number of feature end points
 */

const countFeatureEndPoints = object => {
  let endPointsCount = 0;

  // call function recursively for nested features
  if (Array.isArray(object)) {
    // -> array of feature objects: loop through objects in array (this is just an intermediate step)
    object.forEach(arrayObject => {
      endPointsCount += countFeatureEndPoints(arrayObject);
    });
  } else if (object.hasOwnProperty('dependentFeature')) {
    // -> feature object with nested feature object: don't count and only recurse through children, because
    // parent / child relation is graphed as a straight line that does not require adjustment of angle
    endPointsCount += countFeatureEndPoints(object.dependentFeature);
  } else {
    // -> standard object: increase count to adjust angle for even spacing of features
    endPointsCount++;
  }

  return endPointsCount;
};

export default countFeatureEndPoints;
