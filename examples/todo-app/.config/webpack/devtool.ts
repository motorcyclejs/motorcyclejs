export const DEVELOPMENT = 'development'

if (!process.env.BUILD_ENV)
  process.env.BUILD_ENV = DEVELOPMENT

export const devtool =
  process.env.BUILD_ENV === DEVELOPMENT ? 'cheap-source-map' : ''
