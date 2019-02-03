import * as React from 'react';
import styled from 'styled-components';

import sectionColor from './utils/sectionColor';

const Features = ({renderTree}) => {
  return null;
  // var self = this,
  //   // $details = $('#js_roadmapDetails'), // TODO: get this property from constructor
  //   connectorClasses,
  //   parent,
  //   parentPoint,
  //   classes,
  //   labelAttributes;
  // // draw all dots and labels
  // this.state.renderTree.forEach(function(feature, index) {
  //   if (index > 0) {
  //     classes = [
  //       'roadmap__feature', // class for styling with CSS
  //       'js_feature', // base class for targeting features
  //       'js_section-' + (feature.section + 1), // class for targeting all features of a section
  //       'js_interval-' + feature.interval, // class for targeting all features of an interval
  //     ];
  //     labelAttributes = self.getLabelAttributes(feature.angle, feature.radius);
  //     // group dot and label into one 'feature'
  //     self.paper
  //       .g(
  //         // feature dot
  //         self.paper
  //           .circle(feature.center.x, feature.center.y, self.diagramRadii.dot)
  //           .addClass('roadmap__feature-dot js_featureDot ' + self.getColorOfSection(feature.section, 'stroke')),
  //         // feature label
  //         self.paper
  //           .text(labelAttributes.x, labelAttributes.y, feature.name)
  //           .addClass('roadmap__feature-label js_featureLabel')
  //           .attr({
  //             'text-anchor': labelAttributes.textAnchor,
  //           })
  //       )
  //       .attr({
  //         id: 'js_feature-' + index,
  //       })
  //       .addClass(classes.join(' '))
  //       .hover(
  //         function() {
  //           if (!this.hasClass(self.stateClass.filteredOut)) {
  //             // get feature details and fade in details placeholder
  //             $details
  //               .html(
  //                 // find corresponding legend entry and get its markup
  //                 // TODO: this should be done with the featureId so jQuery can be removed
  //                 $('.js_legendEntry > h3:contains(' + feature.name + ')')
  //                   .parent('li')
  //                   .html()
  //               )
  //               .stop(true, true)
  //               .animate({opacity: 1}, 50);
  //           }
  //         },
  //         function() {
  //           if (!this.hasClass(self.stateClass.filteredOut)) {
  //             // empty details placeholder and fade it out
  //             $details
  //               .html('')
  //               .stop(true, true)
  //               .animate({opacity: 0}, 50);
  //           }
  //         }
  //       );
  //   }
  // });
};

export default Features;
