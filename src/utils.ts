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

function Logger(groupName: string, prefix: string) {
  this.prefix = prefix;
  this.groupName = groupName;
}

Logger.prototype.group = function () {
  console.group(this.groupName);
};

Logger.prototype.groupEnd = function () {
  console.groupEnd();
};

Logger.prototype.log = function (...params) {
  console.log(this.prefix, ...params);
};

Logger.prototype.error = function (...params) {
  console.error(this.prefix, ...params);
};

export { normalizeCommand, Logger };
