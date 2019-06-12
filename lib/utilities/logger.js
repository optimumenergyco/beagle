import _ from "lodash";
import chalk from "chalk";

function rawOut(message) {
  process.stdout.write(`${ message }\n`);
}

function info(message) {
  rawOut(`👋 ${ message }`);
}

function success(message) {
  rawOut(chalk.greenBright(`👍 ${ message }`));
}

function error(message) {
  rawOut(chalk.redBright(`✋ ${ message }`));
}

function notice(message) {
  rawOut(chalk.blueBright(`👉 ${ message }`));
}

function logParseException(exception, migration) {

  error(exception.message);

  if (_.isNil(exception.position)) {
    return;
  }

  let sql = migration.sql;
  let position = exception.position;
  let lineNumber = sql.slice(0, position).match(/\n/g).length;
  let lines = sql.split("\n");

  error(`  Offset: ${ position }`);
  error(`  Line: ${ lineNumber }`);

  let offset = 0;
  for (let line of lines) {
    // Newline is chomped by split we need to add +1 here
    if (offset + line.length + 1 >= position) {
      rawOut("");
      rawOut(line);
      rawOut(chalk.redBright(`${ " ".repeat(position - offset - 1) }⬆️`));
      rawOut("");
      break;
    }
    // Newline is chomped by split we need to add +1 here
    offset = offset + line.length + 1;
  }
}

export default { info, success, error, notice, logParseException };
