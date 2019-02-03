import styled from 'styled-components';

import Box from '../../atoms/box';

const Body = styled(Box)`
  /*
   * 1 - Fill all available vertical space
   */

  align-items: stretch;
  background: ${({theme}) => theme.color.background.white};
  flex: 1; /* 1 */
`;

export default Body;
