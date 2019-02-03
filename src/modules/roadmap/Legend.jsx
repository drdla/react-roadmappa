import * as React from 'react';
import styled from 'styled-components';

import getFeatures from './utils/getFeatures';
import sectionColor from './utils/sectionColor';

import Box from '../../components/atoms/box';
import {UL} from '../../components/atoms/list';

const FeatureList = styled(UL)``;

const SectionTitle = styled.h2`
  ${({section, sections}) => sectionColor(section, sections, 'color')}

  text-align: center;
`;

const Section = styled.div`
  padding: ${({theme}) => theme.size.default};
  width: ${({numberOfColumns}) => 100 / numberOfColumns}%;
`;

const StyledLegend = styled(Box).attrs(() => ({
  flexWrap: 'wrap',
}))`
  width: 100%;
`;

const Legend = ({data, numberOfColumns = 3}) => (
  <StyledLegend>
    {data.map(({businessValue, features}, i) => (
      <Section key={i + 1} numberOfColumns={numberOfColumns}>
        <SectionTitle section={i} sections={data.length}>
          {businessValue}
        </SectionTitle>
        <FeatureList>{getFeatures(features, i)}</FeatureList>
      </Section>
    ))}
  </StyledLegend>
);

export default Legend;
