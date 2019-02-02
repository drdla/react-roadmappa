import {css} from 'styled-components';

const expandDownIn = css`
  @keyframes expandDownIn {
    from {
      transform: scaleY(0);
    }

    to {
      transform: scaleY(1);
    }
  }

  /*
   * 1 - Keep appearance of last keyframe
   */

  animation: ${({theme}) => theme.transition.time.fast} expandDownIn ${({theme}) => theme.transition.style.dynamic};
  animation-fill-mode: forwards; /* 1 */
`;

export default expandDownIn;
