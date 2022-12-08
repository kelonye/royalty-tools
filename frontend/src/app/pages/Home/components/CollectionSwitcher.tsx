import React from 'react';
import { MenuItem } from '@mui/material';

import { useCoralCube } from '@app/contexts/coral-cube';

import * as S from './CollectionSwitcher.styled';

const CollectionSwitcher: React.FC = () => {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<Element | null>(null);
  const { collections, collection, setCollection } = useCoralCube();

  const handleOpenMenu = (currentTarget: Element) => {
    setMenuAnchorEl(currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleSelectCollection = async (collection: string) => {
    handleCloseMenu();
    setCollection(collection);
  };

  return (
    <S.Container>
      <S.Button
        variant='outlined'
        color='inherit'
        aria-haspopup='true'
        onClick={(e) => {
          handleOpenMenu(e.currentTarget);
        }}
      >
        {formatCollectionName(collection)}
      </S.Button>

      {!collections ? null : (
        <S.Menu
          anchorEl={menuAnchorEl}
          keepMounted
          open={Boolean(menuAnchorEl)}
          onClose={handleCloseMenu}
        >
          {collections.map((collection) => (
            <MenuItem
              key={collection}
              onClick={() => handleSelectCollection(collection)}
            >
              {formatCollectionName(collection)}
            </MenuItem>
          ))}
        </S.Menu>
      )}
    </S.Container>
  );
};

export default CollectionSwitcher;

function formatCollectionName(name: string | null) {
  return name?.replace(/_/g, ' ').toUpperCase() ?? null;
}
