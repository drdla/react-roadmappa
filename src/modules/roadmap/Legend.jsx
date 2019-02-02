import * as React from 'react';
import styled from 'styled-components';

import getFeatures from './utils/getFeatures';
// import getSectionColor from './utils/getSectionColor';

import Box from '../../components/atoms/box';
import {UL} from '../../components/atoms/list';

const FeatureList = styled(UL)``;

const SectionTitle = styled.h2`
  color: ${({theme}) => theme.color.text.default /* getSectionColor(sectionNumber, 'color') */};
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

const Legend = ({data, numberOfColumns = 4}) => (
  <StyledLegend>
    {data.map(({businessValue, features}, i) => (
      <Section key={i + 1} numberOfColumns={numberOfColumns}>
        <SectionTitle>{businessValue}</SectionTitle>
        <FeatureList>{getFeatures(features, i)}</FeatureList>
      </Section>
    ))}
  </StyledLegend>
);

export default Legend;
