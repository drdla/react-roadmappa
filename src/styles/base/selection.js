import {css} from 'styled-components';

const selection = css`
  /*
   * Control the background-color of selected text
   */

  ::selection {
    background: ${({theme}) => theme.color.background.default};
  }
`;

export default selection;
