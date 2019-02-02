import * as React from 'react';
import {ThemeProvider} from 'styled-components';

import AppLayout from './modules/layout';
import Roadmap from './modules/roadmap';

import GlobalStyles from './styles';
import theme from './theme';

import roadmap from './fixtures/roadmap';

const App = () => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <GlobalStyles />
      <AppLayout roadmapTitle={roadmap.metadata.title}>
        <Roadmap data={roadmap} />
      </AppLayout>
    </React.Fragment>
  </ThemeProvider>
);

export default App;
