import { join } from 'path';
import * as Mocha from 'mocha';
import * as expand from 'glob-expand';

const mocha = new Mocha();

let testPaths = process.argv.slice(2);

if (testPaths.length === 0)
  testPaths = ['src/**/*.test.ts', 'src/*.test.ts'];

const cwd = join(__dirname, '..');

const files = expand({ filter: 'isFile', cwd }, testPaths);

files.forEach(file => {
  mocha.addFile(join(cwd, file));
});

mocha.run(function (failures: number) {
  process.exit(failures);
});
