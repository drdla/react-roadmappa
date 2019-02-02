import {css} from 'styled-components';

const headings = css`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: normal;
  }

  h1 {
    font-size: ${({theme}) => theme.font.size.pageTitle};
    text-align: center;
  }

  h2 {
    font-size: ${({theme}) => theme.font.size.huge};
  }

  h3 {
    font-size: ${({theme}) => theme.font.size.large};
  }

  h4,
  h5,
  h6 {
    font-size: ${({theme}) => theme.font.size.default};
  }
`;

export default headings;
