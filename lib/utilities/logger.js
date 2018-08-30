import chalk from 'chalk';

function rawOut(message) {
  process.stdout.write(`${ message }\n`);
}

function info(message) {
  rawOut(`》${ message }`);
}

function success(message) {
  rawOut(chalk.greenBright(`✔️ ${ message }`));
}

function error(message) {
  rawOut(chalk.redBright(`❗ ${ message }`));
}

function notice(message) {
  rawOut(chalk.blueBright(`➡️ ${ message }`));
}

export default { info, success, error, notice };
