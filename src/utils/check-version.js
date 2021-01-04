const semver = require("semver");
const log = require("./log");
const packageConfig = require("../../package.json");
const shell = require("shelljs");

function exec(cmd) {
  //脚本可以通过 child_process 模块新建子进程，从而执行 Unix 系统命令
  //下面这段代码实际就是把cmd这个参数传递的值转化成前后没有空格的字符串，也就是版本号
  //https://nodejs.org/api/child_process.html这是nodejs的子进程教程
  //require('child_process') node的模块，execSync(cmd)创建同步进程
  return require("child_process").execSync(cmd).toString().trim();
}

const nodeVersionRequirement = {
  name: "node", // node版本的信息
  currentVersion: semver.clean(process.version), // 使用semver插件吧版本信息转化成规定格式，也就是 ' =v1.2.3 ' -> '1.2.3' 这种功能
  versionRequirement: packageConfig.engines.node, // 这是规定的package.json中engines选项的node版本信息 "node":">= 4.0.0"
};

let npmVersionRequirement = undefined;
if (shell.which("npm")) {
  npmVersionRequirement = {
    name: "npm",
    currentVersion: exec("npm --version"), // 自动调用npm --version命令，并且把参数返回给exec函数，从而获取纯净的版本号
    versionRequirement: packageConfig.engines.npm, // 这是规定的pakage.json中engines选项的node版本信息 "npm": ">= 3.0.0"
  };
}

module.exports = {
  checkNodeVersion() {
    if (
      !semver.satisfies(
        nodeVersionRequirement.currentVersion,
        nodeVersionRequirement.versionRequirement
      )
    ) {
      log.error(
        `node版本 ${nodeVersionRequirement.currentVersion} 不符合当前版本要求`
      );
      log.info(`请使用 ${nodeVersionRequirement.versionRequirement}`);
      return false;
    }
    return true;
  },

  checkNpmVersion() {
    if (
      !semver.satisfies(
        npmVersionRequirement.currentVersion,
        npmVersionRequirement.versionRequirement
      )
    ) {
      log.error(
        `npm版本 ${npmVersionRequirement.currentVersion} 不符合当前版本要求`
      );
      log.info(`请使用 ${npmVersionRequirement.versionRequirement}`);
      return false;
    }
    return true;
  },

  checkVersion() {
    const result = this.checkNodeVersion() && this.checkNpmVersion();
    if (!result) {
      process.exit(1);
    }
  },
};
