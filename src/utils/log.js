const chalk = require("chalk");
const inquirer = require("inquirer");
const ui = new inquirer.ui.BottomBar();

module.exports = {
  error(msg, code) {
    ui.log.write(chalk.red(`Error${code ? "-" + code : ""}: ${msg}`));
  },

  warn(msg, code) {
    ui.log.write(chalk.yellow(`Warn${code ? "-" + code : ""}: ${msg}`));
  },

  info(msg) {
    ui.log.write(`${msg}`);
  },

  success(msg, code) {
    ui.log.write(chalk.green(`Success${code ? "-" + code : ""}: ${msg}`));
  },
};
