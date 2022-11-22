import React from 'react';
import { withI18next } from 'storybook-addon-i18next';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../src/styles/globalStyles';
import theme from '../src/styles/theme';
import i18n from './i18n';
import { themes } from '@storybook/theming';

export const decorators = [
  withI18next({ i18n, languages: { ko: '한국어', en: 'English' } }),
  (Story) => (
    <React.Suspense fallback='loading...'>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Story />
      </ThemeProvider>
    </React.Suspense>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: themes.dark,
  },
};
