import * as React from 'react';
import styled from 'styled-components';

import sectionColor from './utils/sectionColor';

import CircleSegment from './CircleSegment';

const StyledBackground = styled(CircleSegment)`
  ${({section, sections}) => sectionColor(section, sections, 'fill')};

  cursor: pointer;
  opacity: 0.13; // TODO: dim the background; better use hsla colors, because transparency is problematic for printing
  stroke: ${({theme}) => theme.color.border.white};
  stroke-width: 1px;
  transition: opacity 0.05s;
`;

const DiagramSectionBackground = ({commonProps, innerRadius, intervals, outerRadius, section, sections}) => (
  <React.Fragment>
    {Array.from(Array(intervals), (_, i) => i).map(i => {
      // classes = [
      //   'roadmap__segment', // class for styling with CSS
      //   this.getColorOfSection(section, 'fill'), // color class
      //   'js_segment', // base class for targeting segments
      //   'js_interval-' + (currentInterval + 1), // class for targeting all segments of an interval
      //   'js_section-' + (section + 1), // class for targeting all segments of a section
      // ];
      //   .attr({
      //     'data-interval': currentInterval + 1, // store for interaction with elements in interval
      //   })
      //   .hover(
      //     function() {
      //       self.highlightSegments(this, self, 'interval');
      //     },
      //     function() {
      //       self.removeSegmentHighlights(self);
      //     }
      //   )
      //   .mousedown(function() {
      //     self.applyIntervalFilter(this, self);
      //   });
      return (
        <StyledBackground
          key={i}
          {...commonProps}
          outerRadius={outerRadius(i)}
          innerRadius={innerRadius(i)}
          section={section}
          sections={sections}
        />
      );
    })}
  </React.Fragment>
);

export default DiagramSectionBackground;
