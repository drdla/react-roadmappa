import * as React from 'react';
import Fullscreen from 'react-full-screen';
import styled from 'styled-components';

import Menu from './Menu';
import {FullscreenToggle, MenuToggle} from './HeaderButtons';
import {Body, Footer, Header, Main, PageLayout, Sidebar} from '../../components/templates/app-layout';

import theme from '../../theme';

const PageContent = styled(Main).attrs(() => ({
  flexDirection: 'column',
}))`
  padding: ${({theme}) => theme.size.default};
  width: 100%;
  overflow-y: scroll;
`;

const RoadmapTitle = styled.h1`
  margin: 0;
  padding: ${({theme}) => theme.size.default};
`;

const AppLayout = ({children, roadmapTitle}) => {
  const [isFullscreen, toggleFullscreen] = React.useState(false);
  const [hasMenu, toggleMenu] = React.useState(false);

  return (
    <PageLayout>
      <Fullscreen enabled={isFullscreen} onChange={isFullscreen => toggleFullscreen(isFullscreen)}>
        {hasMenu ? <Menu isVisible={hasMenu} /> : null}
        <Header>
          <Sidebar alignItems="center">
            <MenuToggle
              isActive={hasMenu}
              onClick={() => toggleMenu(!hasMenu)}
              style={{
                position: 'relative',
                zIndex: theme.zIndex.topmost3,
              }}
            />
          </Sidebar>
          <Main alignItems="center" justifyContent="center">
            <RoadmapTitle>{roadmapTitle}</RoadmapTitle>
          </Main>
          <Sidebar alignItems="center" justifyContent="flex-end">
            <FullscreenToggle isActive={isFullscreen} onClick={() => toggleFullscreen(!isFullscreen)} />
          </Sidebar>
        </Header>
        <Body>
          <PageContent>{children}</PageContent>
        </Body>
        <Footer>
          <Sidebar />
          <Main justifyContent="center">101110110110020010111</Main>
          <Sidebar />
        </Footer>
      </Fullscreen>
    </PageLayout>
  );
};

export default AppLayout;
