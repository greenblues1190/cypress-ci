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

function isJSONFile(filename: string) {
  const regexJsonFile = new RegExp('.json$', 'i');

  return regexJsonFile.test(filename);
}

export { normalizeCommand, isJSONFile };
