import * as React from 'react';
import styled from 'styled-components';

import Box from '../../components/atoms/box';

import {animation, mixin} from '../../styles';

const menuItems = [
  {
    label: 'Print',
    link: 'javascript:window.print();',
  },
  {
    label: 'Edit',
    link: '#',
  },
  {
    label: 'Open',
    link: '#',
  },
  {
    label: 'New',
    link: '#',
  },
];

const MenuItem = ({label, link}) => (
  <li>
    <a href={link}>{label}</a>
  </li>
);

const MenuItems = styled.ul`
  margin: 0;
  padding: 0;
  width: 100%;

  li {
    font-size: ${({theme}) => theme.font.size.large};
    list-style: none;
    margin: 0;
    padding: 0;
  }

  a {
    display: block;
    padding: ${({theme}) => theme.size.large};
    text-align: center;
    user-select: none;
  }
`;

const StyledMenu = styled(Box).attrs(() => ({
  alignItems: 'center',
  justifyContent: 'center',
}))`
  /*
  * 1 - Cover entire viewport
  */

  ${animation.fadeIn}
  ${mixin.pinTopLeftFixed}

  animation-duration: ${({theme}) => theme.transition.time.slow};
  background: ${({theme}) => theme.color.background.overlay};
  height: 100%; /* 1 */
  width: 100%; /* 1 */


  ${({isVisible, theme}) =>
    isVisible
      ? `
        opacity: 1;
        z-index: ${theme.zIndex.topmost1};
        `
      : `
        opacity: 0;
        z-index: ${theme.zIndex.recessed};
        `}
`;

const Menu = ({isVisible}) => (
  <StyledMenu isVisible={isVisible}>
    <MenuItems>
      {menuItems.map(i => (
        <MenuItem key={i} {...i} />
      ))}
    </MenuItems>
  </StyledMenu>
);

export default Menu;
