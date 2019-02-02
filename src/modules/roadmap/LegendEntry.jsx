import * as React from 'react';
import styled from 'styled-components';

import {LI} from '../../components/atoms/list';

const StyledLegendEntry = styled(LI)`
  padding-bottom: ${({theme}) => theme.size.default};
`;

const EntryName = styled.h3`
  margin: 0;
`;

const EntryDescription = styled.dfn``;

const LegendEntry = ({description, name}) => (
  <StyledLegendEntry>
    <EntryName>{name}</EntryName>
    <EntryDescription>{description}</EntryDescription>
  </StyledLegendEntry>
);

export default LegendEntry;
