import { exec, ExecException } from 'child_process';
import fs from 'fs';
import cypress from 'cypress';
import waitOn from 'wait-on';
import { normalizeCommand } from './utils';

const ESRCH = 3;

function isExecException(err: unknown): err is ExecException {
  return (err as ExecException).code !== undefined;
}

function serve(serveScript: string) {
  console.log('starting server...');
  const process = exec(serveScript, (error) => {});

  function shutdown() {
    try {
      process.kill('SIGINT');
      console.log('shutdown server gracefully.');
    } catch (err: unknown) {
      if (isExecException(err) && (err as ExecException).code === ESRCH) {
        console.log('server is existed before shutdown it.');

        return;
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
  console.log('Test succeeded! Your build is good to go.');
}

async function serveAndTest({
  serveScript,
  url,
  timeout,
}: {
  serveScript: string;
  url: string;
  timeout: number;
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

  try {
    await waitOn({
      resources: [url],
      timeout,
      headers: {
        Accept: 'text/html, application/json, text/plain, */*',
      },
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 304,
    });

    await test(configOptions);
  } finally {
    service.shutdown();
  }
}

function run({
  serveScript,
  url,
  timeout,
}: {
  serveScript: string;
  url: string;
  timeout: number;
}) {
  console.log('cypress-ci is running.');

  serveAndTest({
    serveScript: normalizeCommand(serveScript),
    url,
    timeout,
  }).catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });
}

export { run };
