#! /usr/bin/env node
const { program } = require('commander');
const { run } = require('./e2e');

program
  .option('-s, --serve <serve>', 'script to run server', 'start')
  .option('-u, --url <url>', 'url to test', 'http://localhost:3000')
  .version('0.1.0')
  .parse();

const { serve, url } = program.opts();

run({ serveScript: serve, url });