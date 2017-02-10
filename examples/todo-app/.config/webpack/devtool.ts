export const DEVELOPMENT = 'development';

if (!process.env.BUILD_ENV)
  process.env.BUILD_ENV = DEVELOPMENT;

export const devtool =
  process.env.BUILD_ENV === DEVELOPMENT ? 'inline-source-map' : '';
