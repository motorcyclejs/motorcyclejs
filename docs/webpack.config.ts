import {
  BabiliPlugin,
  DEVELOPMENT,
  HtmlPlugin,
  TsLoader,
  devServer,
  devtool,
  distPath,
  resolve,
  srcPath,
} from './.config/webpack';

import { join } from 'path';

const entry =
  {
    app: join(srcPath, 'bootstrap.ts'),
  };

const output =
  {
    path: distPath,
    filename: 'docs.js',
  };

const plugins =
  [
    HtmlPlugin,
  ];

if (process.env.BUILD_ENV !== DEVELOPMENT)
  plugins.push(BabiliPlugin);

const loaders =
  [
    TsLoader,
  ];

export =
  {
    entry,
    output,
    devServer,
    devtool,
    plugins,
    resolve,
    module:
      {
        loaders,
      },
  };
