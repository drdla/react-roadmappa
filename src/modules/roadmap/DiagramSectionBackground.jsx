import * as React from 'react';

import CircleSegment from './CircleSegment';

const DiagramSectionBackground = ({commonProps, innerRadius, intervals, outerRadius}) => (
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
      return <CircleSegment key={i} {...commonProps} outerRadius={outerRadius(i)} innerRadius={innerRadius(i)} />;
    })}
  </React.Fragment>
);

export default DiagramSectionBackground;
