import {createGlobalStyle} from 'styled-components';

import boxSizing from './base/boxSizing';
import headings from './atoms/headings';
import images from './atoms/images';
import inputs from './atoms/inputs';
import links from './atoms/links';
import normalize from './base/normalize';
import page from './base/page';
import placeholders from './atoms/placeholders';
import reset from './base/reset';
import selection from './base/selection';
import shared from './base/shared';
import tables from './atoms/tables';
import text from './atoms/text';
import textareas from './atoms/textareas';

const GlobalStyles = createGlobalStyle`
  /*
   * Base
   */
  ${boxSizing}
  ${normalize}
  ${reset}
  ${shared}
  ${selection}
  ${page}

  /*
   * Atoms
   */
  ${headings}
  ${images}
  ${inputs}
  ${links}
  ${placeholders}
  ${tables}
  ${textareas}
  ${text}
`;

export default GlobalStyles;
