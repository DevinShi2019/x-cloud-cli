try {
  const commander = require("commander");
  const chalk = require("chalk");
  const version = require("../package.json").version;
  const commandConfig = require("./config");
  const checkVersion = require("./utils/check-version");
  const log = require("./utils/log");

  checkVersion.checkVersion();

  commander.version(version).usage("[options] <file ...>");

  commander.on("--help", () => {
    log.info("Examples:");
    log.info(`  $ ${chalk.green("x-cloud-cli init")} `);
    log.info(`  $ ${chalk.green("x-cloud-cli list")} `);
    log.info(`  $ ${chalk.green("x-cloud-cli config set a 1")} `);
  });

  // 未知命令会报错
  commander.on("command:*", function () {
    commander.outputHelp();
    process.exit(1);
  });

  // 动作
  Object.keys(commandConfig).forEach((action) => {
    commander
      .command(action)
      .alias(commandConfig[action].alias)
      .description(commandConfig[action].description)
      .action(function (...args) {
        log.info(action, ...args);
        if (
          commandConfig[action].executor &&
          commandConfig[action].executor.apply
        ) {
          commandConfig[action].executor.apply.call(this, action, ...args);
        }
      }); // 要分段
  });

  if (!process.argv.slice(2).length) {
    commander.outputHelp();
    process.exit(1);
  }

  commander.parse(process.argv);
} catch (error) {
  console.error(error);
}
