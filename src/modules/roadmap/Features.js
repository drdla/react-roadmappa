import * as React from 'react';
import styled from 'styled-components';

import labelAttributes from './utils/labelAttributes';
import sectionColor from './utils/sectionColor';

import {diagramRadii} from './constants';

const Dot = styled.circle.attrs(({center}) => ({
  cx: center.x,
  cy: center.y,
  r: diagramRadii.dot,
}))`
  ${({section, sections}) => sectionColor(section, sections, 'stroke')}

  fill: ${({theme}) => theme.color.background.white};
  stroke-width: 1.5px;
  transform-origin: center center;
  transition: 0.1s ease-in;
`;

const Label = styled.text.attrs(({x, y}) => ({
  x,
  y,
}))`
  cursor: default;
  dominant-baseline: middle;
  fill: ${({theme}) => theme.color.text.default};
  font-size: ${({theme}) => theme.font.size.small};
  text-anchor: ${({textAnchor}) => textAnchor};
  transition: 0.1s ease-in;
  user-select: none;
`;

const Feature = styled.g`
  cursor: pointer;
`;

const Features = ({renderTree, sections}) => (
  <React.Fragment>
    {renderTree.map(({angle, center, name, radius, section}, i) =>
      i === 0 ? null : (
        <Feature key={i}>
          <Dot center={center} section={section} sections={sections} />
          <Label {...labelAttributes(angle, radius)}>{name}</Label>
        </Feature>
      )
    )}
  </React.Fragment>
);

export default Features;
