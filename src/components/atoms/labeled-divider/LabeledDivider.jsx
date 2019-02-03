/*
 * Divider line with a centered label.
 *
 * Usage:
 * <LabeledDivider>
 *   Section B
 * </LabeledDivider>
 */

import React from 'react';
import styled from 'styled-components';
import {node, string} from 'prop-types';

import {mixin} from '../../../styles';

const HR = styled.hr`
  background: ${({theme}) => theme.color.border.lighter};
  border: 0;
  height: ${({theme}) => theme.border.width.default};
  margin-bottom: 0;
  width: 100%;
`;

const Divider = styled.div`
  padding: ${({theme}) => theme.size.default} ${({theme}) => theme.size.large};
  text-align: center;
  width: 100%;
`;

const Label = styled.span`
  /*
   * 1 - Cover divider line; use background color to make it look like the hr has a gap
   * 2 - Pull up over divider line; since the center--x mixing also uses translate, we have to define all three valus
   * 3 - Don't wrap
   */

  ${mixin.centerX}

  background: ${({theme}) => theme.color.background.white}; /* 1 */
  color: ${({theme}) => theme.color.text.lightest};
  display: inline-block; /* 1 */
  transform: translate3d(-50%, -50%, 0); /* 2 */
  padding: ${({theme}) => theme.size.default}; /* 1 */
  white-space: nowrap; /* 3 */
`;

const LabeledDivider = ({children, className, style}) => {
  return (
    <Divider className={className} styled={style}>
      <HR />
      <Label>{children}</Label>
    </Divider>
  );
};

LabeledDivider.propTypes = {
  children: node,
  className: string,
};

export default LabeledDivider;
