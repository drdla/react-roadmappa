import styled from 'styled-components';

import Box from '../../atoms/box';

import {mixin} from '../../../styles';

const PageLayout = styled(Box)`
  /*
   * 1 - Cover entire viewport
   * 2 - Center on screen horizontally if the screen is wider than our max-width
   */

  ${mixin.centerMX} /* 2 */

  align-items: stretch;
  flex-direction: column;
  height: 800px; /* 1 */
  height: 100vh; /* 1 */
  width: 100%; /* 1 */
`;

export default PageLayout;
