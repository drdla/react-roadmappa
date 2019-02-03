/*
 * Usage
 * default:
 *   <Icon name="create-offer"/>
 * full:
 *   <Icon name="add" size="small" rotate="-90" className="flamboyant" />
 */

import * as React from 'react';
import styled from 'styled-components';
import {number, object, oneOf, oneOfType, string} from 'prop-types';
import {size as sizePolished, stripUnit} from 'polished';

import IconPaths from './IconPaths';

export const iconSize = (theme, size) => {
  switch (size) {
    case 'tiny':
      return theme.size.small;

    case 'small':
      return theme.size.default;

    case 'large':
      return stripUnit(theme.size.default) * 3;

    case 'huge':
      return stripUnit(theme.size.default) * 6;

    default:
      return stripUnit(theme.size.default) * 1.5;
  }
};

const StyledIcon = styled.svg.attrs(() => ({
  role: 'img',
  viewBox: '0 0 84 84',
}))`
  ${({rotate}) => (rotate ? `transform: rotate(${rotate}deg)` : '')};
  ${({size, theme}) => sizePolished(iconSize(theme, size))}
  display: inline-block;
  fill: ${({light, theme}) => (light ? theme.color.text.lightest : 'currentColor')};
  position: relative;
  transition: transform ${({theme}) => theme.transition.time.fast};
  vertical-align: middle;
`;

const Icon = props => <StyledIcon {...props}>{IconPaths[props.name]}</StyledIcon>;

Icon.propTypes = {
  className: string,
  color: oneOf(['inherit', 'light']),
  name: string.isRequired,
  rotate: oneOfType([string, number]),
  size: oneOf(['default', 'tiny', 'small', 'large']),
  style: object,
};

export default Icon;
