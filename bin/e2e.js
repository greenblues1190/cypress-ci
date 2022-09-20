const { exec } = require('child_process');
const fs = require('fs');
const cypress = require('cypress');
const waitOn = require('wait-on');
const { normalizeCommand, Logger } = require('./utils');

const logger = new Logger('cypress-ci@0.1.0', '[cypress-ci]');

function serve(serveScript) {
  logger.log('starting server...');
  const process = exec(serveScript);

  function shutdown() {
    try {
      process.kill('SIGINT');
      logger.log('shutdown server gracefully.');
    } catch (err) {
      if (err.code === 'ESRCH') {
        logger.log('server is existed before shutdown it.');
      }

      throw err;
    }
  }

  process.on('error', (err) => {
    throw err;
  });

  process.stdout.on('data', function (data) {
    console.log(data);
  });

  return {
    process,
    shutdown,
  };
}

function test(configOptions) {
  return cypress.run(configOptions).then((testResults) => {
    if (testResults.totalFailed > 0) {
      const filename = `stats-${testResults.startedTestsAt}.json`;
      const statsJson = JSON.stringify(testResults);

      fs.writeFileSync(filename, statsJson);

      throw new Error(`Test failed. Stats file is exported to '${filename}'`);
    }

    logger.log('Test succeeded! Your build is good to go.');
  });
}

function serveAndTest({ serveScript, url }) {
  const configOptions = {
    browser: 'electron',
    e2e: {
      baseUrl: url,
    },
    video: false,
    screenshotOnRunFailure: false,
  };

  const service = serve(serveScript);

  return waitOn({
    resources: [url],
  }).then(() => {
    return test(configOptions).finally(() => {
      service.shutdown();
    });
  });
}

function run({ serveScript, url }) {
  logger.group();

  serveAndTest({ serveScript: normalizeCommand(serveScript), url })
    .then(() => {
      logger.groupEnd();
    })
    .catch((err) => {
      logger.error(err);
      logger.groupEnd();
      process.exit(1);
    });
}

module.exports = { run };
