import { styled, Button as MUIButton, Menu as MUIMenu } from '@mui/material';

const WIDTH = 200;

export const Container = styled('div')(
  ({
    theme: {
      breakpoints,
      typography: { pxToRem },
    },
  }) => ({})
);

export const Button = styled(MUIButton)(
  ({
    theme: {
      breakpoints,
      typography: { pxToRem },
    },
  }) => ({
    height: '56px',
    width: pxToRem(WIDTH),
  })
);

export const Menu = styled(MUIMenu)(
  ({
    theme: {
      breakpoints,
      typography: { pxToRem },
    },
  }) => ({
    '.MuiPaper-root': {
      width: pxToRem(WIDTH),
      marginTop: '4px',
    },
  })
);
