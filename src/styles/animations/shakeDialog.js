import {css} from 'styled-components';

const shakeDialog = css`
  @keyframes shakeDialog {
    from,
    to {
      transform: translate3d(0, 0, 0);
    }

    20%,
    60% {
      transform: translate3d(-8%, 0, 0);
    }

    40%,
    80% {
      transform: translate3d(8%, 0, 0);
    }
  }

  animation: ${({theme}) => theme.transition.time.slow} shakeDialog ease-in-out;
  animation-fill-mode: both;
`;

export default shakeDialog;
