import { distPath } from './paths';

export const devServer =
  {
    inline: true,
    host: '0.0.0.0',
    port: 8080,
    contentBase: distPath,
    historyApiFallback: true,
  };
