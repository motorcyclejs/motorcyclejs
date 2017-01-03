import { EOL } from 'os';
import { join } from 'path';
import { command, alias, description, each, Stdio, EachHandlerOptions } from 'northbrook';
import { execute, isFile } from 'northbrook/helpers';

export const plugin =
  command(alias('karma'), description('Run your browser tests with Karma'));

each(plugin, function ({ pkg: { path, name } }: EachHandlerOptions, io: Stdio) {
  if (!isFile(join(path, 'karma.conf.js'))) return Promise.resolve();

  io.stdout.write(`Running karma tests in ${name}...` + EOL + EOL);

  return execute('karma', ['start', '--single-run'], io, path)
    .then(() => io.stdout.write(`Completed karma tests in ${name}` + EOL + EOL));
})
  .catch(() => process.exit(1));
