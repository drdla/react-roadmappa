import * as React from 'react';
import {ThemeProvider} from 'styled-components';

import GlobalStyles from './styles';
import theme from './theme';

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <GlobalStyles />
          <div>
            hi <a href="#">Click me!</a>
          </div>
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default App;
