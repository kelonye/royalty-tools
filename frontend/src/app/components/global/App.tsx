import React, { FC } from 'react';
import { Toaster } from 'react-hot-toast';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { BrowserRouter as Router } from 'react-router-dom';
import muiTheme from '@styles/mui-theme';

import { UIProvider } from '@app/contexts/ui';
import { CoralCubeProvider } from '@app/contexts/coral-cube';

import Layout from './Layout/Layout';

export const App: FC = () => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      localeText={{ start: 'Start', end: 'End' }}
      locale='en-GB'
    >
      <MUIThemeProvider theme={muiTheme}>
        <Router>
          <CssBaseline />
          <UIProvider>
            <CoralCubeProvider>
              <Layout />

              <Toaster
                toastOptions={{
                  style: {
                    background: 'rgba(78, 68, 206)',
                    color: 'white',
                    width: 'auto',
                  },
                  success: {
                    style: {
                      background: '#3aff6f',
                      color: '#190834',
                    },
                  },
                  error: {
                    style: {
                      background: 'rgba(235, 55, 66)',
                    },
                  },
                }}
                position='bottom-center'
                reverseOrder={false}
              />
            </CoralCubeProvider>
          </UIProvider>
        </Router>
      </MUIThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
