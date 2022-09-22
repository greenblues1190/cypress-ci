#! /usr/bin/env node
import { program } from 'commander';
import { run } from './index';

program
  .option('-s, --serve <serve>', 'script to run server', 'start')
  .option('-u, --url <url>', 'url to test', 'http://localhost:3000')
  .option(
    '-t, --timeout <timeout>',
    'maximum time in ms to wait for a server response',
    '60000',
  )
  .option('-c, --config <path>', 'path to cypress config json file')
  .version('0.2.1')
  .parse();

const { serve, url, timeout, config } = program.opts();

run({
  serveScript: serve,
  url,
  timeout: Number(timeout),
  configFilePath: config,
});
