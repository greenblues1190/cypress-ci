# cypress-ci

Integrate [Cypress](https://www.cypress.io/) into your CI provider

## Features

- [x] **out of the box** (integration without extra jobs)
- [x] **automated** (start server and test, abort CI build when a test fails)
- [x] **safe** (no more `Ctrl-C`, server will be shutdown gracefully)
- [x] **extendable** (import local Cypress configuration file)
- [x] **reports** (export test result as a file while logging console outputs)

## Usages

Add the script below in build script in your CI provider before a build.

```sh
cypress-ci -s <serve> -u <url>
```

### Examples

Jenkins freestyle with npm scripts

```bash
#!/bin/bash
cd /var/lib/jenkins/workspace/your-project-directory
npm ci
npm run cypress:ci
npm run build
```

## Installation

### npm

```sh
npm install --save-dev cypress-ci
```

### yarn

```sh
yarn add --dev cypress-ci
```

## Integration with CI providers

### Prerequisites

You need [dependencies](https://docs.cypress.io/guides/continuous-integration/introduction.html#Dependencies) below before running Cypress in CI providers.

#### Use official Cypress docker images

Read official Cypress documents

- https://docs.cypress.io/examples/examples/docker#Images
- https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/

#### Install manually on Linux

Ubuntu/Debian

```sh
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

CentOS

```sh
yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-deve
```

### npm scripts

```json
"scripts": {
  "start": "webpack serve --config webpack.config.js",
  "cypress:ci": "cypress-ci -s start -u http://localhost:3000 -c cypress.ci.json"
}
```

#### Available Options

| option            | description                                      | default                 |
| ----------------- | ------------------------------------------------ | ----------------------- |
| `-s`, `--serve`   | script to run server                             | `start`                 |
| `-u`, `--url`     | url to test                                      | `http://localhost:3000` |
| `-t`, `--timeout` | maximum time in ms to wait for a server response | 60000                   |
| `-V`, `--version` | output the version number                        |
| `-h`, `--help`    | display help for command                         |

## Roadmap

- [x] Import and override Cypress config file
- [x] Support typescript
- [ ] Run on a docker image
- [ ] Provide webpack plugin

## License

MIT
