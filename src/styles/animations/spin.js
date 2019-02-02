import {css} from 'styled-components';

const spin = css`
  @keyframes spin {
    from {
      transform: rotate(0deg) scale(0.9) translateX(2px);
    }

    to {
      transform: rotate(360deg) scale(0.9) translateX(2px);
    }
  }

  animation: 600ms spin ${({theme}) => theme.transition.style.dynamic} infinite;
  animation-fill-mode: both;
`;

export default spin;
