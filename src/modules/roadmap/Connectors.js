import * as React from 'react';
import styled from 'styled-components';

import parentCenter from './utils/parentCenter';
import sectionColor from './utils/sectionColor';

const Connector = styled.path.attrs(({path}) => ({
  d: path,
}))`
  ${({section, sections}) => sectionColor(section, sections, 'stroke')}
  stroke-linecap: round;
  stroke-width: 1.25px;
  transition: opacity ${({theme}) => theme.transition.time.veryFast} ease-in;
`;

const Connectors = ({absMiddle, renderTree, sections}) => (
  <React.Fragment>
    {renderTree.map(({center: c, parentFeatureId, section}, i) => {
      if (i === 0) {
        return null;
      }

      const p = parentCenter(renderTree[parentFeatureId], absMiddle);

      return (
        <Connector key={i} path={['M', c.x, c.y, 'L', p.x, p.y].join(' ')} section={section} sections={sections} />
      );
    })}
  </React.Fragment>
);

export default Connectors;
