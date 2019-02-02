import styled from 'styled-components';

import Box from '../../atoms/box';

const Footer = styled(Box)`
  /*
   * 1 - Add ample vertical spacing to set footer apart from content visually
   */

  padding-bottom: ${({theme}) => theme.size.large}; /* 1 */
  padding-top: ${({theme}) => theme.size.huge}; /* 1 */
`;

export default Footer;
