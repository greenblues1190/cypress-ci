import { join } from 'path';
import { existsSync } from 'fs';

function isPackageScriptName(command: string) {
  const packageFilename = join(process.cwd(), 'package.json');
  const packageJson = require(packageFilename);

  return existsSync(packageFilename) && Boolean(packageJson.scripts?.[command]);
}

function normalizeCommand(command: string) {
  return isPackageScriptName(command) ? `npm run ${command}` : command;
}

export { normalizeCommand };
