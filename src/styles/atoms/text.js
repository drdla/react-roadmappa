import {css} from 'styled-components';

const text = css`
  /*
   * Default text styles for various elements.
   */

  /*
   * 1 - Use native system font of the respective OS for more native feel of the application
   */

  body {
    color: ${({theme}) => theme.color.text.default};
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue,
      Helvetica, Arial, sans-serif; /* 1 */
  }

  p {
    margin: 0 0 1em;
  }

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  dfn {
    color: ${({theme}) => theme.color.text.lighter};
    font-style: italic;
  }

  cite {
    font-style: normal;
  }

  sub,
  sup {
    font-size: 0.66em; /* stylelint-disable-line */
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sup {
    top: -0.4em;
  }

  sub {
    bottom: -0.33em;
  }
`;

export default text;
