import {css} from 'styled-components';

const page = css`
  /* ==========================================================================
     #PAGE
     ========================================================================== */

  /**
   * Simple page-level setup.
   *
   * 1. Set the default 'font-size' and 'line-height' for the entire project,
   *    sourced from our default variables. The 'font-size' is calculated to exist
   *    in ems, the 'line-height' is calculated to exist unitlessly.
   * 2. Force scrollbars to always be visible to prevent awkward ‘jumps’ when
   *    navigating between pages that do/do not have enough content to produce
   *    scrollbars naturally.
   * 3. Ensure the page always fills at least the entire height of the viewport.
   */

  html {
    background: ${({theme}) => theme.color.background.white};
    font-size: ${({theme}) => theme.font.size.default}; /* 1 */
    line-height: 1.5; /* 1 */
    min-height: 100%; /* 3 */
    overflow-y: scroll; /* 2 */
  }
`;

export default page;
