import {css} from 'styled-components';

import {color} from '../../lib';

export const input = css`
  appearance: none;
  background: ${({theme}) => color.transparentize(theme.color.background.white, 0.08)};
  border-radius: ${({theme}) => theme.border.radius.default};
  border: ${({theme}) => theme.border.width.default} solid ${({theme}) => theme.color.border.default};
  box-shadow: none;
  caret-color: ${({theme}) => theme.color.primary.default};
  display: inline-block;
  font: inherit;
  height: 2em;
  max-width: 19em;
  outline: none;
  padding: 0.5em;
  transition: border-color ${({theme}) => theme.transition.time.fast} ease-in-out;
  width: 100%;

  :hover,
  :active,
  :focus {
    border-color: ${({theme}) => theme.color.clickable.highlight};
    outline: none;
  }
`;
