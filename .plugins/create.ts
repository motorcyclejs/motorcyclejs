import { EOL } from 'os';
import { writeFileSync, openSync, closeSync } from 'fs';
import { join } from 'path';
import { command, alias, description, withCallback } from 'northbrook';
import * as mkdirp from 'mkdirp';
import { prompt, input } from 'typed-prompts';

export const create =
  command(alias('create'), description('Create a new managed package'));

export { create as plugin };

type Answers = { description: string, author: string };

withCallback(create, function ({ args, directory }, io) {
  if (!args[0])
    return io.stderr.write(`A directory to create your new package was not specified`);

  const packageName = args[0];
  const packageDirectory = join(directory, packageName);

  const testScript =
    `nb tslint --only @motorcyle/${packageName} && nb mocha --only @motorcycle/${packageName}`;

  const packageTemplate = (answers: Answers) =>
`{
  "name": "@motorcycle/${packageName}",
  "version": "0.0.0",
  "description": "${answers.description}",
  "main": "lib/index.js",
  "jsnext:main": "lib.es2015/index.js",
  "module": "lib.es2015/index.js",
  "typings": "lib.es2015/index.d.ts",
  "files": [
    "lib",
    "lib.es2015"
  ],
  "scripts": {
    "test": "${testScript}"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/motorcyclejs/motorcyclejs"
  },
  "author": "${answers.author}",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/motorcyclejs/motorcyclejs/issues"
  },
  "homepage": "https://github.com/motorcyclejs/motorcyclejs#readme"
}
`;

  io.stdout.write(`Generating @motorcycle/${packageName}...`);

  // create packageDirectory
  mkdirp(packageDirectory, (err: any) => {
    if (err) return io.stderr.write(err.message || err);

    // ask some questions to help generate package.json
    prompt<Answers>([
      input('description', 'Please describe your new Motorcycle package:'),
      input('author', 'Who is primarily authoring this package?'),
    ]).then(answers => {

      // create package.json
      writeFileSync(
        join(packageDirectory, 'package.json'),
        packageTemplate(answers),
        { encoding: 'utf8' },
      );

      // create empty .npmignore
      touch(join(packageDirectory, '.npmignore'));

      const srcDirectory = join(packageDirectory, 'src');

      // create src directory
      mkdirp(join(srcDirectory, 'src'), (error: any) => {
        if (error) return io.stderr.write(error.message || error);

        // create index.ts
        writeFileSync(join(srcDirectory, 'index.ts'), `export * from './${packageName}';\n`);

        // create initial file
        writeFileSync(
          join(srcDirectory, `${packageName}.ts`),
          `export function ${packageName}() {}\n`,
        );

        // create initial test file
        touch(join(srcDirectory, `${packageName}.test.ts`));

        io.stdout.write(` complete!` + EOL);
      });
    });
  });
});

function touch (filePath: string) {
  return closeSync(openSync(filePath, 'w'));
}
