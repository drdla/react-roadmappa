import {css} from 'styled-components';

export const link = css`
  /*
   * 1 - Vertical-align: top is required with display: inline-block to prevent weird spacing
   *     that's super hard to debug
   */

  color: ${({theme}) => theme.color.clickable.default};
  cursor: pointer;
  display: inline-block;
  display: inline-block;
  text-decoration: none;
  transition: color ${({theme}) => theme.transition.time.medium} ${({theme}) => theme.transition.style.dynamic};
  vertical-align: top; /* 1 */

  /*
   * 1 - I don't like underlining
   */
  :active,
  :focus,
  :hover {
    text-decoration: none; /* 1 */
  }

  /*
   * 1 - Remove box shadows
   * 2 - Remove dotted outline
   */
  :active,
  :focus,
  :visited {
    box-shadow: none; /* 1 */
    outline: 0 none; /* 2 */
  }

  :visited {
    color: ${({theme}) => theme.color.clickable.default};
  }

  svg {
    fill: currentColor;
  }

  :active,
  :focus,
  :hover,
  :visited:hover {
    color: ${({theme}) => theme.color.clickable.highlight};

    /*
     * 1 - Inherit the color value of the parent element
     */
    svg {
      fill: currentColor; /* 1 */
    }
  }

  ${({disabled, theme}) =>
    disabled &&
    `
      &,
      :hover {
        color: ${theme.color.text.lighter};
        cursor: not-allowed;
        font-style: italic;
        font-weight: ${theme.font.weight.normal};
      }
    `};
`;

export const linkArea = css`
  background: ${({theme}) => theme.color.background.lighter};
  color: ${({theme}) => theme.color.clickable.default};
  cursor: pointer;
  display: inline-block;
  text-decoration: none;

  /*
   * 1 - I don't like underlining
   */
  :active,
  :focus,
  :hover {
    text-decoration: none; /* 1 */
  }

  /*
   * 1 - Remove box shadows
   * 2 - Remove dotted outline
   */
  :active,
  :focus,
  :visited {
    box-shadow: none; /* 1 */
    outline: 0 none; /* 2 */
  }

  &:visited {
    color: ${({theme}) => theme.color.clickable.default};
  }

  svg {
    fill: currentColor;
  }

  :active,
  :focus,
  :hover,
  :visited:hover {
    background: ${({theme}) => theme.color.background.clickable};
    color: ${({theme}) => theme.color.clickable.highlight};

    /*
     * 1 - Inherit the color value of the parent element
     */
    svg {
      fill: currentColor; /* 1 */
    }
  }
`;

export const linkDisabled = css`
  &,
  &:hover {
    color: ${({theme}) => theme.color.text.lightest};
    cursor: not-allowed; /* stylelint-disable-line plugin/no-unsupported-browser-features */
    font-style: italic;
  }
`;
