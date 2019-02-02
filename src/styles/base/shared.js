import {css} from 'styled-components';

const shared = css`
  /* ==========================================================================
     #SHARED
     ========================================================================== */

  /**
   * Shared declarations for certain elements.
   */

  /**
   * Always declare margins in the same direction:
   * csswizardry.com/2012/06/single-direction-margin-declarations
   */

  address,
  blockquote,
  p,
  pre,
  dl,
  figure,
  hr,
  fieldset {
    margin-bottom: ${({theme}) => theme.size.default};
  }

  /**
   * Consistent indentation for lists.
   */

  dd,
  ol,
  ul {
    margin-left: ${({theme}) => theme.size.default};
  }
`;

export default shared;
