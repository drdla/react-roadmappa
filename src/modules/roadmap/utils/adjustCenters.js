import cartesianCenter from './cartesianCenter';

const adjustCenters = (featureChains, intervalRadii, renderTree) => {
  /*
   * Evenly distribute centers of features in one dependency chain that belong to the same interval within the
   * interval.
   */

  let adjustedCenter;
  let adjustedRadius;
  let feature;
  let featureId;
  let radii;
  let splitIntervalBy;
  let subInterval;
  let subIntervalRadius;

  const adjustedFeatureChains = featureChains.forEach(interval => {
    interval.forEach(dependencyChain => {
      const l = dependencyChain.length;

      if (!(l > 1)) {
        // only handle 'real' dependency chains, i.e. arrays with more than 1 element
        return;
      }

      dependencyChain.forEach((d, i) => {
        // calculate adjusted feature center
        splitIntervalBy = l + 1; // interval needs to accommodate l elements + 1 for spacing
        subInterval = i + 1; // feature is element i of elements in interval (fix zero base)
        featureId = d;
        feature = renderTree[featureId];
        radii = intervalRadii[feature.interval - 1];
        subIntervalRadius = (radii.outer - radii.inner) / splitIntervalBy;
        adjustedRadius = radii.inner + subIntervalRadius * subInterval;
        adjustedCenter = cartesianCenter(feature.angle, adjustedRadius);

        // update renderTree
        feature.center = adjustedCenter;
        feature.radius = adjustedRadius;
      });
    });
  });

  return adjustedFeatureChains;
};

export default adjustCenters;
