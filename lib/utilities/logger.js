import chalk from 'chalk';

function info(message) {
  process.stdout.write(`${ message }\n`);
}

function success(message) {
  info(chalk.green(message));
}

function error(message) {
  info(chalk.red(message));
}

function notice(message) {
  info(chalk.blue(message));
}

export default { info, success, error, notice };
