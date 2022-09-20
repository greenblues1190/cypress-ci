# cypress-ci

Integrate [Cypress](https://www.cypress.io/) into your CI provider

## Features

- [x] Start server and test in parallel
- [x] Stop CI build when test failed
- [x] Out of the box integration with CI providers
- [x] No more `Ctrl-C`, Server will be shutdown gracefully
- [x] Export stats file while logging console outputs

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

> Disclaimer: You need dependencies below before running cypress in CI providers.

https://docs.cypress.io/guides/continuous-integration/introduction.html#Dependencies

#### Ubuntu/Debian

```sh
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

#### CentOS

```sh
yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-deve
```

### npm scripts

```json
"scripts": {
  "start": "webpack serve",
  "test:ci": "cypress-ci -s start -u 'http://localhost:3000"
}
```

#### Available Options

| option            | description               | default                 |
| ----------------- | ------------------------- | ----------------------- |
| `-s`, `--serve`   | script to run server      | `start`                 |
| `-u`, `--url`     | url to test               | `http://localhost:3000` |
| `-V`, `--version` | output the version number |
| `-h`, `--help`    | display help for command  |

### build script

1. Make sure that you install Node.js and all the [dependencies](#prerequisites).

2. Add the script below in build script in your CI provider before a build.

```sh
npm run test:ci
```

## Examples

### Jenkins freestyle

```bash
#!/bin/bash
cd /var/lib/jenkins/workspace/your-project-directory
npm ci
npm run test:ci
npm run build
```

## Roadmap

- Import and override Cypress config file
- Provide webpack plugin
- Support typescript

## License

MIT
