/*
 * Write the business value of the current section on a curved text path on top of the section.
 *
 * @param   {Number}    currentSection  Number of the current section; value has to be zero-based!
 */

const DiagramSectionLabel = ({section, sections}) => {
  const fraction = 360 / sections;
  const startAngle = fraction * section;
  const endAngle = startAngle + fraction;

  return null;

  // (labelArc = this.paper
  //   .path(
  //     this.describeArc(
  //       this.absMiddle,
  //       this.absMiddle,
  //       this.perc2Abs(this.diagramRadii.sectionLabel + '%'),
  //       endAngle,
  //       startAngle
  //     )
  //   )
  //   .toDefs()), // prevent the browser from displaying the path
  //   (classes = [
  //     'roadmap__segment-label', // class for styling with CSS
  //     this.getColorOfSection(currentSection, 'fill'), // color class
  //     'js_segment-label', // class for targeting labels
  //   ]),
  //   (labelText = this.paper
  //     .text(
  //       0, // position of text comes from textpath, so the values here don't matter
  //       0,
  //       this.data.roadmap[currentSection].businessValue
  //     )
  //     .addClass(classes.join(' '))
  //     .attr({
  //       'data-section': currentSection + 1, // store for interaction with elements
  //       'text-anchor': 'middle',
  //       textpath: labelArc,
  //     })
  //     .hover(
  //       function() {
  //         self.highlightSegments(this, self, 'section');
  //       },
  //       function() {
  //         self.removeSegmentHighlights(self);
  //       }
  //     )
  //     .mousedown(function() {
  //       self.applySectionFilter(this, self);
  //     }));

  // labelText.textPath.attr({startOffset: '50%'}); // render the text in the middle of the path
};

export default DiagramSectionLabel;
