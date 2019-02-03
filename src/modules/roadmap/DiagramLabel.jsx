import * as React from 'react';
import styled from 'styled-components';

import {diagramRadii} from './constants';

const LabelBackground = styled.circle.attrs(() => ({
  cx: '50%',
  cy: '50%',
  r: `${diagramRadii.segmentMin}%`,
}))`
  fill: ${({theme}) => theme.color.background.offWhite};
`;

const LabelText = styled.text.attrs(() => ({
  x: '50%',
  y: '49.75%',
}))`
  fill: ${({theme}) => theme.color.text.default};
  font-size: ${({theme}) => theme.font.size.default};
  text-anchor: middle;
`;

const DiagramLabel = ({text}) => {
  // const hasLineBreaks = (text.join(' ').match(/(\n)|(<br>)|(<br[\s]?\/>)/g) || []).length > 1;
  // regex to find line breaks
  // adjust vertical position of label, if the text has more than two lines:
  // - pull up by half of its height to compensate varying label height
  // - push down by one line
  // label.attr({
  //   y: this.perc2Abs('50%') - label.getBBox().height / 2 + 14, // TODO: not 14px on mobile screens!
  // });

  // TODO: fix tspan positions

  return (
    <React.Fragment>
      <LabelBackground />
      <LabelText>{text.map(t => (text.length > 1 ? <tspan x="50%">{t}</tspan> : {t}))}</LabelText>
    </React.Fragment>
  );
};

export default DiagramLabel;
