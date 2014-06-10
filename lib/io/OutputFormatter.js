/**
 * Created by roc on 29/05/14.
 */
"use strict";

function OutputFormatter(formatter) {
  this.formatter = formatter;
}

OutputFormatter.prototype.changeFormatter = function changeFormatterFunc(fn) {
  this.formatter = fn;
};

OutputFormatter.prototype.execute = function executeFunc(data) {
  return this.formatter(data);
};

module.exports = OutputFormatter;