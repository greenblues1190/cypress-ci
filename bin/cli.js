#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("./index");
commander_1.program
    .option('-s, --serve <serve>', 'script to run server', 'start')
    .option('-u, --url <url>', 'url to test', 'http://localhost:3000')
    .version('0.1.0')
    .parse();
const { serve, url } = commander_1.program.opts();
(0, index_1.run)({ serveScript: serve, url });
