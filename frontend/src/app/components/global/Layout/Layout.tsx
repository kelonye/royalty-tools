import React, { FC, useEffect } from 'react';

import Home from '@app/pages/Home/Home';

import * as S from './Layout.styled';

const Layout: FC = () => {
  useEffect(() => {
    document.getElementById('boot-loader')!.classList.add('hidden');
  }, []);

  return (
    <S.Container>
      <Home />
    </S.Container>
  );
};

export default Layout;
