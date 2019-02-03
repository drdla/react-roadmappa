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

const LineWrapper = styled.tspan.attrs(({absMiddle, index}) => ({
  x: '50%',
  y: absMiddle + (index === 0 ? -12 : 12),
  // - label.getBBox().height; TODO: not 14px on mobile screens!
}))`
  transform: translateX(-50%);
`;

const LabelText = styled.text.attrs(() => ({
  x: '50%',
  y: '48%',
}))`
  fill: ${({theme}) => theme.color.text.default};
  font-size: ${({theme}) => theme.font.size.large};
  text-anchor: middle;
  transform: translateY(${({theme}) => theme.font.size.small});
`;

const DiagramLabel = ({absMiddle, text}) => {
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
      <LabelText>
        {text.map((t, i) =>
          text.length > 1 ? (
            <LineWrapper key={i} index={i} absMiddle={absMiddle}>
              {t}
            </LineWrapper>
          ) : (
            {t}
          )
        )}
      </LabelText>
    </React.Fragment>
  );
};

export default DiagramLabel;
