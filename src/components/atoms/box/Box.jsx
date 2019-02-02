/* eslint-disable */

import * as React from 'react';
import styled from 'styled-components';
import {bool, node, number, object, oneOf, oneOfType, string} from 'prop-types';

// The number `0` with no unit is a valid CSS length, see:
//   https://www.w3.org/TR/CSS2/syndata.html#length-units
// Though it might be inappropriate/avoidable in certain contexts, if it is
// valid CSS, we should allow it.
const isTruthyOrZero = value => value || value === 0;

const Box = styled(
  ({
    alignContent,
    alignItems,
    alignSelf,
    children,
    display,
    element,
    flex,
    flexBasis,
    flexDirection,
    flexGrow,
    flexShrink,
    flexWrap,
    height,
    justifyContent,
    margin,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    order,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    width,
    ...props
  }) => React.createElement(element, props, children)
)`
  ${({alignContent}) => alignContent && `align-content: ${alignContent};`}
  ${({alignItems}) => alignItems && `align-items: ${alignItems};`}
  ${({alignSelf}) => alignSelf && `align-self: ${alignSelf};`}
  ${({display}) => display && `display: ${display};`}
  ${({flex}) => isTruthyOrZero(flex) && `flex: ${flex};`}
  ${({flexBasis}) => isTruthyOrZero(flexBasis) && `flex-basis: ${flexBasis};`}
  ${({flexDirection}) => flexDirection && `flex-direction: ${flexDirection};`}
  ${({flexGrow}) => isTruthyOrZero(flexGrow) && `flex-grow: ${flexGrow};`}
  ${({flexShrink}) => isTruthyOrZero(flexShrink) && `flex-shrink: ${flexShrink};`}
  ${({flexWrap}) => flexWrap && `flex-wrap: ${flexWrap};`}
  ${({height}) => isTruthyOrZero(height) && `height: ${height};`}
  ${({justifyContent}) => justifyContent && `justify-content: ${justifyContent};`}
  ${({margin}) => isTruthyOrZero(margin) && `margin: ${margin};`}
  ${({marginBottom}) => isTruthyOrZero(marginBottom) && `margin-bottom: ${marginBottom};`}
  ${({marginLeft}) => isTruthyOrZero(marginLeft) && `margin-left: ${marginLeft};`}
  ${({marginRight}) => isTruthyOrZero(marginRight) && `margin-right: ${marginRight};`}
  ${({marginTop}) => isTruthyOrZero(marginTop) && `margin-top: ${marginTop};`}
  ${({maxHeight}) => isTruthyOrZero(maxHeight) && `max-height: ${maxHeight};`}
  ${({maxWidth}) => isTruthyOrZero(maxWidth) && `max-width: ${maxWidth};`}
  ${({minHeight}) => isTruthyOrZero(minHeight) && `min-height: ${minHeight};`}
  ${({minWidth}) => isTruthyOrZero(minWidth) && `min-width: ${minWidth};`}
  ${({order}) => isTruthyOrZero(order) && `order: ${order};`}
  ${({padding}) => isTruthyOrZero(padding) && `padding: ${padding};`}
  ${({paddingBottom}) => isTruthyOrZero(paddingBottom) && `padding-bottom: ${paddingBottom};`}
  ${({paddingLeft}) => isTruthyOrZero(paddingLeft) && `padding-left: ${paddingLeft};`}
  ${({paddingRight}) => isTruthyOrZero(paddingRight) && `padding-right: ${paddingRight};`}
  ${({paddingTop}) => isTruthyOrZero(paddingTop) && `padding-top: ${paddingTop};`}
  ${({position}) => position && `position: ${position};`}
  ${({width}) => isTruthyOrZero(width) && `width: ${width};`}
`;

Box.propTypes = {
  alignContent: oneOf(['center', 'flex-end', 'flex-start', 'space-around', 'space-between', 'stretch']),
  alignItems: oneOf(['baseline', 'center', 'flex-end', 'flex-start', 'stretch']),
  alignSelf: oneOf(['baseline', 'center', 'flex-end', 'flex-start', 'stretch']),
  children: node,
  display: oneOf(['flex', 'inline-flex']),
  element: oneOf(['article', 'aside', 'div', 'figure', 'footer', 'header', 'main', 'nav', 'section']),
  flex: oneOfType([string, number]),
  flexBasis: oneOfType([string, number]),
  flexDirection: oneOf(['column-reverse', 'column', 'row-reverse', 'row']),
  flexGrow: oneOfType([string, number]),
  flexShrink: oneOfType([string, number]),
  flexWrap: oneOf(['nowrap', 'wrap-reverse', 'wrap']),
  height: oneOfType([string, number]),
  inline: bool,
  justifyContent: oneOf(['center', 'flex-end', 'flex-start', 'space-around', 'space-between']),
  margin: oneOfType([string, number]),
  marginBottom: oneOfType([string, number]),
  marginLeft: oneOfType([string, number]),
  marginRight: oneOfType([string, number]),
  marginTop: oneOfType([string, number]),
  maxHeight: oneOfType([string, number]),
  maxWidth: oneOfType([string, number]),
  minHeight: oneOfType([string, number]),
  minWidth: oneOfType([string, number]),
  order: number,
  padding: oneOfType([string, number]),
  paddingBottom: oneOfType([string, number]),
  paddingLeft: oneOfType([string, number]),
  paddingRight: oneOfType([string, number]),
  paddingTop: oneOfType([string, number]),
  position: oneOf(['static', 'relative', 'absolute', 'fixed', 'sticky', 'inherit']),
  style: object,
  width: oneOfType([string, number]),
};

Box.defaultProps = {
  display: 'flex',
  element: 'div',
  position: 'relative',
};

export default Box;
