import styled from 'styled-components';

import Box from '../../atoms/box';

const minHeaderHeight = '0px';

const Header = styled(Box).attrs(({alignItems, flexDirection}) => ({
  alignItems: alignItems || 'center',
  flexDirection: flexDirection || 'row',
}))`
  min-height: ${minHeaderHeight};
`;

export default Header;
