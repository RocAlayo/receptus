"use strict";

var dataInterface = require("../InputData.interface");

function InputDataMockup(data) {
  this.data = data;
}

InputDataMockup.prototype = Object.create(dataInterface);

InputDataMockup.prototype.config = function configFunc(params) {

};

InputDataMockup.prototype.get = function getFunc() {
  return this.data;
};

module.exports = InputDataMockup;