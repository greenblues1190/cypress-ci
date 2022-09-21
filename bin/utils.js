"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJSONFile = exports.normalizeCommand = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
function isPackageScriptName(command) {
    var _a;
    const packageFilename = (0, path_1.join)(process.cwd(), 'package.json');
    const packageJson = require(packageFilename);
    return (0, fs_1.existsSync)(packageFilename) && Boolean((_a = packageJson.scripts) === null || _a === void 0 ? void 0 : _a[command]);
}
function normalizeCommand(command) {
    return isPackageScriptName(command) ? `npm run ${command}` : command;
}
exports.normalizeCommand = normalizeCommand;
function isJSONFile(filename) {
    const regexJsonFile = new RegExp('.json$', 'i');
    return regexJsonFile.test(filename);
}
exports.isJSONFile = isJSONFile;
