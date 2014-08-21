/**
 * Created by roc on 29/05/14.
 */
"use strict";

function OutputData(formatter) {
  this.formatter = formatter;
}

OutputData.prototype.changeFormatter = function changeFormatterFunc(fn) {
  this.formatter = fn;
};

OutputData.prototype.getFormatter = function getFormatterFunc() {
  return this.formatter;
};

OutputData.prototype.execute = function executeFunc() {
  return this.formatter.apply(this, Array.prototype.slice.call(arguments));
};

module.exports = OutputData;
