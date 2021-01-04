const download = require("download-git-repo");
const log = require("../../utils/log");
const ora = require("ora");
const fileUtil = require("../../utils/file-util");

module.exports = {
  downloadTemplate(repo, projectName, successCallback) {
    const spinner = ora("下载中...");
    spinner.start();
    download(repo, fileUtil.getTemplatePath(repo), (err) => {
      if (err) {
        spinner.fail();
        log.warn(`Generation failed. ${err}`);
        return;
      }
      // 结束加载图标
      spinner.succeed();
      if (successCallback) {
        successCallback();
      } else {
        log.success("\n Generation completed!");
        log.info("\n To get started");
        log.info(`\n    cd ${projectName} \n`);
      }
    });
  },
};
