import theme from '../../theme';

const spaceBetweenSelf = (size = 'default', direction = 'vertical') => {
  let margin;

  switch (direction) {
    case 'horizontal':
      margin = 'margin-left';
      break;

    case 'vertical':
    default:
      margin = 'margin-top';
  }

  return `
    /*
     * 1 - Add space between elements of the same type
     */

    & + & {
      ${margin}: ${size === 'minimal' ? '1px' : theme.size[size] || theme.size.default}; /* 1 */
    }

    /*
     * 1 - Ignore empty elements
     */

    :empty {
      ${margin}: 0; /* 1 */
    }
  `;
};

export default spaceBetweenSelf;
