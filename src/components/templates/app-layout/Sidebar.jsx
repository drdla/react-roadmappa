import styled from 'styled-components';

import Box from '../../atoms/box';

const Sidebar = styled(Box).attrs(({flex, flexDirection}) => ({
  flex: flex || `1 112px`,
  flexDirection: flexDirection || 'column',
}))`
  padding: ${({theme}) => theme.size.small};
  ${({scrollY}) => scrollY && 'overflow-y: scroll;'}
`;

export default Sidebar;
