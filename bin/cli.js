#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("./index");
commander_1.program
    .option('-s, --serve <serve>', 'script to run server', 'start')
    .option('-u, --url <url>', 'url to test', 'http://localhost:3000')
    .option('-t, --timeout <timeout>', 'maximum time in ms to wait for a server response', '60000')
    .option('-c, --config <path>', 'path to cypress config json file', 'cypress.ci.json')
    .version('0.1.0')
    .parse();
const { serve, url, timeout, config } = commander_1.program.opts();
(0, index_1.run)({
    serveScript: serve,
    url,
    timeout: Number(timeout),
    configFilePath: config,
});
