import { styled, TableCell } from '@mui/material';

import { BORDER_RADIUS } from '@app/config';

export const Container = styled('div')(
  ({ theme: { breakpoints, palette } }) => ({
    backgroundColor: palette.background.paper,
    gridArea: 'table',
    borderRadius: BORDER_RADIUS,
  })
);

export const AddressTableCell = styled(TableCell)(
  ({ theme: { breakpoints } }) => ({
    '& > div': {
      justifyContent: 'flex-end',
      marginRight: '-1.5rem',
      '& > span': {
        marginLeft: '0.5rem',
      },
    },
  })
);
