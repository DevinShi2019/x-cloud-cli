const initAction = require("./actions/init");

module.exports = {
  init: {
    alias: "i",
    description: "项目构建",
    examples: ["x-cloud-cli init"],
    executor: initAction,
  },
  config: {
    alias: "con",
    description: "rc 文件配置",
    examples: [
      "x-cloud-cli config set <key> <value> <n>",
      "x-cloud-cli config get <key> <n>",
      "x-cloud-cli config remove <key> <n>",
    ],
  },
  list: {
    // 打开当前本地模板列表
    alias: "l",
    description: "查看当前本地模板列表",
    examples: ["x-cloud-cli list"],
  },
  new: {
    // 创建
    alias: "n",
    description: "创建自定义页面或者模板（开发中）",
    examples: ["x-cloud-cli new"],
  },
};
