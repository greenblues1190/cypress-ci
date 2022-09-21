import { exec } from 'child_process';
import fs from 'fs';
import cypress from 'cypress';
import waitOn from 'wait-on';
import { normalizeCommand, Logger } from './utils';

const logger = new Logger('cypress-ci@0.1.0', '[cypress-ci]');

function serve(serveScript: string) {
  logger.log('starting server...');
  const process = exec(serveScript);

  function shutdown() {
    try {
      process.kill('SIGINT');
      logger.log('shutdown server gracefully.');
    } catch (err) {
      if (err?.code === 'ESRCH') {
        logger.log('server is existed before shutdown it.');
      }

      throw err;
    }
  }

  process.on('error', (err) => {
    throw err;
  });

  process.stdout?.on('data', function (data) {
    console.log(data);
  });

  return {
    process,
    shutdown,
  };
}

async function test(
  configOptions: Partial<CypressCommandLine.CypressRunOptions>,
) {
  const testResults = await cypress.run(configOptions);

  if (testResults.status === 'failed') {
    throw new Error(testResults.message);
  }

  if ((testResults as CypressCommandLine.CypressRunResult).totalFailed > 0) {
    const filename = `stats-${testResults.startedTestsAt}.json`;
    const statsJson = JSON.stringify(testResults);

    fs.writeFileSync(filename, statsJson);

    throw new Error(`Test failed. Stats file is exported to '${filename}'`);
  }
  logger.log('Test succeeded! Your build is good to go.');
}

async function serveAndTest({
  serveScript,
  url,
}: {
  serveScript: string;
  url: string;
}) {
  const configOptions: Partial<CypressCommandLine.CypressRunOptions> = {
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

  await waitOn({
    resources: [url],
  });
  try {
    return await test(configOptions);
  } finally {
    service.shutdown();
  }
}

function run({ serveScript, url }: { serveScript: string; url: string }) {
  logger.group();

  serveAndTest({ serveScript: normalizeCommand(serveScript), url })
    .then(() => {
      logger.groupEnd();
    })
    .catch((err: Error) => {
      logger.error(err);
      logger.groupEnd();
      process.exit(1);
    });
}

export { run };
