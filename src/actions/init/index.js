const log = require("../../utils/log");
const inquirer = require("inquirer");
const template = require("./template");
const fileUtil = require("../../utils/file-util");
const typeUtil = require("../../utils/type-util");
const path = require("path");
const handlebars = require("handlebars");

const initPrompt = (defaultProjectName) => {
  const prompts = [
    {
      type: "input",
      name: "projectName",
      message: "请输入项目名称",
      default: defaultProjectName,
    },
    {
      type: "list",
      name: "template",
      message: "请选择初始化的项目模板",
      choices: [
        {
          name: "lib-ts: 基于Typescript的库脚手架",
          value: "github:shiyutian123/ts-lib-mock",
        },
        {
          name: "vue-lib-js: 基于Javascript的Vue库脚手架",
          value: "github:DevinShi2019/vue-js-lib-template#main",
        },
      ],
    },
    // {
    //   type: "confirm",
    //   message: "是否需要检测提交代码格式(使用 GitHook)",
    //   name: "needGitHook",
    //   default: true,
    // },
  ];
  return prompts;
};

module.exports = {
  apply: (action, ...args) => {
    if (action === "init") {
      if (args.length > 2) {
        log.warn(`暂时不支持同时创建多个项目，以第一个参数 ${args[0]} 为准`);
      }
      let defaultProjectName = "";
      if (args[0]) {
        defaultProjectName = typeUtil.isString(args[0]) ? args[0] : "vue-lib";
        inquirer.prompt(initPrompt(defaultProjectName)).then((answer) => {
          template.downloadTemplate(answer.template, answer.projectName, () => {
            log.info("Template Download completed!");
            fileUtil.mapDirSync(
              path.resolve(
                process.cwd(),
                fileUtil.getTemplatePath(answer.template, "template")
              ),
              (rPath, data) => {
                const excludes = [
                  /\.(vue|scss|sh|ico|png|gif|jpeg)$/,
                  /.git\//,
                ];
                const filter = fileUtil.pathExclude(rPath, excludes);
                let result = data;
                if (!filter) {
                  result = handlebars.compile(data)(answer);
                }
                const resultPath = rPath.replace(
                  fileUtil.getTemplatePath(answer.template, "template"),
                  answer.projectName
                );
                fileUtil.writeFileRecursiveSync(resultPath, result, () => {});
              }
              // () => {
              //   console.log("finish");
              // },
            );
            log.success("Template Generation completed!");
            log.success("To get started");
            log.success(`cd ${answer.projectName}`);
          });
        });
      }
    } else {
      log.error("当前执行的不是init，严重报错");
    }
  },
};
