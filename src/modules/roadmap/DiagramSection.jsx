import * as React from 'react';

import getRadiiForIntervals from './utils/getRadiiForIntervals';
import perc2Abs from './utils/perc2Abs';

import DiagramSectionBackground from './DiagramSectionBackground';
import DiagramSectionLabel from './DiagramSectionLabel';

const DiagramSection = ({absMiddle, children, intervals, section, sections, size}) => {
  const intervalRadii = getRadiiForIntervals(intervals);

  const fraction = 360 / sections;
  const startAngle = fraction * section;
  const endAngle = startAngle + fraction;

  const commonProps = {
    centerX: absMiddle,
    centerY: absMiddle,
    startAngle,
    endAngle,
  };

  const getRadius = (i, r) => perc2Abs(`${intervalRadii[i][r]}%`, size);
  const outerRadius = i => getRadius(i, 'outer');
  const innerRadius = i => getRadius(i, 'inner');

  return (
    <React.Fragment>
      <DiagramSectionLabel section={section} />
      <DiagramSectionBackground
        intervals={intervals}
        commonProps={commonProps}
        outerRadius={outerRadius}
        innerRadius={innerRadius}
      />
      {children}
    </React.Fragment>
  );
};

export default DiagramSection;
