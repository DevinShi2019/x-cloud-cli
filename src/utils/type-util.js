module.exports = {
  isString(value) {
    return Object.prototype.toString.call(value) === "[object String]";
  },
  isRegExp(value) {
    return Object.prototype.toString.call(value) === "[object RegExp]";
  },
};
