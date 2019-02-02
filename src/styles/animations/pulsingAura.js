import {css} from 'styled-components';

import {color} from '../../lib';

const pulsingAura = css`
  @keyframes pulsingAura {
    0%,
    80%,
    100% {
      box-shadow: 0 0 0 0 ${({theme}) => color.transparentize(theme.color.primary.default, 55)};
    }

    45% {
      box-shadow: 0 0 0 5px ${({theme}) => color.transparentize(theme.color.primary.default, 55)};
    }
  }

  animation: 3400ms pulsingAura infinite ease-in-out;
  animation-fill-mode: both;
`;

export default pulsingAura;
