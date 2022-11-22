const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-styled-component-theme/dist/preset',
    'storybook-addon-i18next/register',
    {
      name: '@storybook/addon-docs',
      options: {
        sourceLoaderOptions: null,
        transcludeMarkdown: true,
      },
    },
    {
      name: 'storybook-addon-next',
      options: {
        nextConfigPath: path.resolve(__dirname, '../next.config.js'),
      },
    },
  ],
  webpackFinal: async (config) => {
    config.resolve.fallback = {
      fs: false,
      tls: false,
      net: false,
      module: false,
      assert: false,
      path: require.resolve('path-browserify'),
    };
    config.resolve.modules = [path.resolve(__dirname, '..'), 'node_modules', 'src/styles'];
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, '../src/components/'),
      '@styles': path.resolve(__dirname, '../src/styles/'),
      '@utils': path.resolve(__dirname, '../src/utils/'),
      '@apis': path.resolve(__dirname, '../src/apis/'),
      '@hooks': path.resolve(__dirname, '../src/hooks/'),
      '@type': path.resolve(__dirname, '../src/type/'),
      '@contexts': path.resolve(__dirname, '../src/contexts/'),
    };

    return config;
  },
  staticDirs: ['../public'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
};
