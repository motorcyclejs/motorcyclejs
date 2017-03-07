import { join } from 'path';
import { srcPath } from './paths';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliWebpackPlugin = require('babili-webpack-plugin');

const HtmlOptions =
  {
    title: `Motorcycle.js`,
    filename: `200.html`,
    inject: `body`,
    template: join(srcPath, 'index.ejs'),
  };

export const HtmlPlugin = new HtmlWebpackPlugin(HtmlOptions);

const BabiliOptions =
  {
    simplify: false, // if true builds fail
    removeDebugger: true,
  };

export const BabiliPlugin = new BabiliWebpackPlugin(BabiliOptions);
