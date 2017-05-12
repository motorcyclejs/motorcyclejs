import { join } from 'path'
import { srcPath } from './paths'

// tslint:disable-next-line:no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin')
// tslint:disable-next-line:no-var-requires
const BabiliWebpackPlugin = require('babili-webpack-plugin')

const HtmlOptions =
  {
    title: `Todo App`,
    filename: `index.html`,
    inject: `body`,
    template: join(srcPath, 'index.ejs'),
  }

export const HtmlPlugin = new HtmlWebpackPlugin(HtmlOptions)

const BabiliOptions =
  {
    simplify: false, // if true builds fail
    removeDebugger: true,
  }

export const BabiliPlugin = new BabiliWebpackPlugin(BabiliOptions)
