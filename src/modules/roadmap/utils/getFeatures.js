import * as React from 'react';

import LegendEntry from '../LegendEntry';

const getFeatures = (features, section) => {
  if (Array.isArray(features)) {
    return <React.Fragment>{features.map(f => getFeatures(f, section))}</React.Fragment>;
  } else if (features.hasOwnProperty('dependentFeature')) {
    return (
      <React.Fragment>
        <LegendEntry key={features.name} {...features} />
        {getFeatures(features.dependentFeature, section)}
      </React.Fragment>
    );
  } else {
    return <LegendEntry key={features.name} {...features} />;
  }
};

export default getFeatures;
