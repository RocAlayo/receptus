"use strict";

function Test() {
  this.num = 8;
}

Test.prototype.doIt = function doIt () {
  return this.num * 2;
};

module.exports = Test;