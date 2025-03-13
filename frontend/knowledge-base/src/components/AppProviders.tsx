import React from 'react';

import ThemeProvider from './contexts/ThemeContext';

const AppProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default AppProviders;
