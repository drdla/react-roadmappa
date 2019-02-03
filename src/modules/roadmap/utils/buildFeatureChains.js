/*
 * Extract and store information, which features that are directly dependent from another are to be rendered
 * in the same interval.
 *
 * @param   {Number}    interval        Number of the interval the feature is planned for
 * @param   {Number}    parentFeatureId ID of the feature that the current feature is dependent from
 * @param   {Number}    featureId       ID of the current feature
 */

const buildFeatureChains = (featureChains, interval, parentFeatureId, featureId) => {
  const fc = [...featureChains];
  let existsInArray;

  if (featureChains[interval]) {
    featureChains[interval].forEach((featureChain, i) => {
      // check for each featureChain in the interval of featureId, if its parentFeatureId is in there
      // -> if so, we have a dependency chain in that interval between the feature and its parent feature
      if (parentFeatureId && featureChain.indexOf(parentFeatureId) !== -1) {
        existsInArray = i;
      }
    });

    if (existsInArray >= 0) {
      // parentFeatureId was found in a dependency chain in that interval -> append featureId to that
      fc[interval][existsInArray].push(featureId);
    } else {
      // start a new dependency chain array for that interval that only contains featureId for now
      fc[interval].push([featureId]);
    }

    return fc;
  } else {
    // the interval does not exist in featureChains -> add it and start a new dependency chain array in it
    fc[interval] = []; // create empty array
    fc[interval].push([featureId]); // push array with featureId in

    return fc;
  }
};

export default buildFeatureChains;
