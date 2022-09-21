"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const cypress_1 = __importDefault(require("cypress"));
const wait_on_1 = __importDefault(require("wait-on"));
const utils_1 = require("./utils");
const ESRCH = 3;
function isExecException(err) {
    return err.code !== undefined;
}
function serve(serveScript) {
    var _a;
    console.log('starting server...');
    const process = (0, child_process_1.exec)(serveScript, (error) => { });
    function shutdown() {
        try {
            process.kill('SIGINT');
            console.log('shutdown server gracefully.');
        }
        catch (err) {
            if (isExecException(err) && err.code === ESRCH) {
                console.log('server is existed before shutdown it.');
                return;
            }
            throw err;
        }
    }
    process.on('error', (err) => {
        throw err;
    });
    (_a = process.stdout) === null || _a === void 0 ? void 0 : _a.on('data', function (data) {
        console.log(data);
    });
    return {
        process,
        shutdown,
    };
}
function test(configOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const testResults = yield cypress_1.default.run(configOptions);
        if (testResults.status === 'failed') {
            throw new Error(testResults.message);
        }
        if (testResults.totalFailed > 0) {
            const filename = `stats-${testResults.startedTestsAt}.json`;
            const statsJson = JSON.stringify(testResults);
            fs_1.default.writeFileSync(filename, statsJson);
            throw new Error(`Test failed. Stats file is exported to '${filename}'`);
        }
        console.log('Test succeeded! Your build is good to go.');
    });
}
function serveAndTest({ serveScript, url, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const configOptions = {
            browser: 'electron',
            config: {
                e2e: {
                    baseUrl: url,
                },
                video: false,
                screenshotOnRunFailure: false,
            },
        };
        const service = serve(serveScript);
        yield (0, wait_on_1.default)({
            resources: [url],
        });
        try {
            yield test(configOptions);
        }
        finally {
            service.shutdown();
        }
    });
}
function run({ serveScript, url }) {
    console.log('cypress-ci is running.');
    serveAndTest({ serveScript: (0, utils_1.normalizeCommand)(serveScript), url }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
exports.run = run;
