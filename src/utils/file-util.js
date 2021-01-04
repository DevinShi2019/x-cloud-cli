const path = require("path");
const fs = require("fs");
const typeUtil = require("../utils/type-util");

function pathExclude(pathname, excludes) {
  if (excludes) {
    const filter = excludes.some((exclude) => {
      if (typeUtil.isString(exclude)) {
        return exclude.length > 5 && pathname.endsWith(exclude);
      } else if (typeUtil.isRegExp(exclude)) {
        return exclude.test(pathname);
      }
    });
    return filter;
  }
}

function mapDir(dir, callback, finish, excludes) {
  fs.readdir(dir, function (err, files) {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((filename, index) => {
      let pathname = path.join(dir, filename);

      fs.stat(pathname, (err, stats) => {
        // 读取文件信息
        if (err) {
          console.log("获取文件stats失败");
          return;
        }

        const filter = pathExclude(pathname, excludes);
        if (filter) {
          return;
        }

        if (Object.prototype.toString.call)
          if (stats.isDirectory()) {
            mapDir(pathname, callback, finish, excludes);
          } else if (stats.isFile()) {
            fs.readFile(pathname, { encoding: "utf-8" }, (err, data) => {
              if (err) {
                console.error(err);
                return;
              }
              callback && callback(pathname, data);
            });
          }
      });
      if (index === files.length - 1) {
        finish && finish();
      }
    });
  });
}

function mapDirSync(dir, callback, excludes) {
  const files = fs.readdirSync(dir);
  files.forEach((filename, index) => {
    let pathname = path.join(dir, filename);
    const stats = fs.statSync(pathname);
    if (excludes) {
      const filter = excludes.some((exclude) => {
        if (typeUtil.isString(exclude)) {
          return exclude.length > 5 && pathname.endsWith(exclude);
        } else if (typeUtil.isRegExp(exclude)) {
          return exclude.test(pathname);
        }
      });
      if (filter) {
        return;
      }
    }
    if (Object.prototype.toString.call)
      if (stats.isDirectory()) {
        mapDirSync(pathname, callback, excludes);
      } else if (stats.isFile()) {
        const data = fs.readFileSync(pathname, { encoding: "utf-8" });
        callback && callback(pathname, data);
      }
  });
}

module.exports = {
  mapDir: mapDir,
  mapDirSync: mapDirSync,
  pathExclude: pathExclude,
  writeFileRecursive: function (path, data, callback) {
    let lastPath = path.substring(0, path.lastIndexOf("/"));
    fs.mkdir(lastPath, { recursive: true }, (err) => {
      if (err) return callback(err);
      fs.writeFile(path, data, function (err) {
        if (err) return callback(err);
        return callback(null);
      });
    });
  },
  writeFileRecursiveSync: function (path, data, callback) {
    let lastPath = path.substring(0, path.lastIndexOf("/"));
    fs.mkdirSync(lastPath, { recursive: true });
    fs.writeFileSync(path, data);
  },
  getTemplatePath(repo, templatePath) {
    const path = repo.split("#")[0];
    return `.template/${path.replace(":", "_TEMPLATE_")}${
      templatePath ? "/" + templatePath : ""
    }`;
  },
};
