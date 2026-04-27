import baseConfig from './vitest.config';

const evalsConfig = {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    exclude: ['**/node_modules/**', '**/.git/**'],
  },
};

export default evalsConfig;
