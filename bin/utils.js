const { join } = require('path');
const { existsSync } = require('fs');

function isPackageScriptName(command) {
  const packageFilename = join(process.cwd(), 'package.json');
  const packageJson = require(packageFilename);

  return existsSync(packageFilename) && Boolean(packageJson.scripts?.[command]);
}

function normalizeCommand(command) {
  return isPackageScriptName(command) ? `npm run ${command}` : command;
}

function Logger(groupName, prefix) {
  this.prefix = prefix;
  this.groupName = groupName;
}

Logger.prototype.group = function () {
  console.group(this.groupName);
};

Logger.prototype.groupEnd = function () {
  console.groupEnd(this.groupName);
};

Logger.prototype.log = function (...params) {
  console.log(this.prefix, ...params);
};

Logger.prototype.error = function (...params) {
  console.error(this.prefix, ...params);
};

module.exports = { normalizeCommand, Logger };
