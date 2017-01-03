import { EOL } from 'os';
import { join } from 'path';
import {
  command,
  alias,
  flag,
  description,
  Pkg,
  Stdio,
  changedPackages,
  withCallback,
  HandlerOptions,
} from 'northbrook';
import { execute, isFile, packagesToExecute } from 'northbrook/helpers';
import { sequence } from '@typed/sequence';

const karmaDescription =
  description('Run your browser tests with Karma');

const changedFlag =
  flag('boolean', alias('changed'),
    description('Only run tests for packages that changed since last release'));

export const plugin =
  command(alias('karma'), changedFlag, karmaDescription);

withCallback(plugin, function (input: HandlerOptions, io: Stdio) {
  if (input.options.changed)
    return runChangedPackages(input.config.packages as Array<string>, io);

  return executeAllPackages(input, io);
});

function executeAllPackages(input: HandlerOptions, io: Stdio) {
  const packages: Array<Pkg> = packagesToExecute(input);

  if (packages.length === 0)
    return io.stderr.write(EOL + `No packages could be found` + EOL + EOL);

  return sequence(packages, runKarma(io));
}

function runChangedPackages(packages: Array<string>, io: Stdio) {
  changedPackages().then(affectedPackages => {
    const packagesToTest =
      getPackagesToTest(packages, Object.keys(affectedPackages));

    if (packagesToTest.length === 0)
      return io.stdout.write(EOL + `No packages need to be tested!` + EOL + EOL);

    return sequence<Pkg>(packagesToTest, runKarma(io));
  });
}

function runKarma(io: Stdio) {
  return function (pkg: Pkg) {
    const { path, name } = pkg;

    if (!isFile(join(path, 'karma.conf.js'))) return Promise.resolve();

    io.stdout.write(`Running karma tests in ${name}...` + EOL);

    return execute('karma', ['start', '--single-run'], io, path)
      .then(() => io.stdout.write(`Completed karma tests in ${name}` + EOL + EOL));
  };
}

export function getPackagesToTest(
  packages: Array<string>,
  affectedPackageNames: Array<string>)
{
  const allPackages = packages.map(getPkg);

  return allPackages.filter(filterAffected(affectedPackageNames));
}

export function getPkg(path: string): Pkg {
  const pkg = require(join(path, 'package.json'));

  return {
    path,
    config: pkg,
    name: pkg.name,
  };
}

function filterAffected(affectedPackageNames: Array<string>) {
  return function (pkg: any) {
    return affectedPackageNames.indexOf(pkg.name) > -1;
  };
}
