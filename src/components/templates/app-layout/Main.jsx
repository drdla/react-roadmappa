import styled from 'styled-components';

import Box from '../../atoms/box';

const Main = styled(Box).attrs(({flex, flexDirection}) => ({
  flex: flex || '4 1 100%',
  flexDirection: flexDirection || 'row',
}))`
  padding: ${({theme}) => theme.size.small};
`;

export default Main;
