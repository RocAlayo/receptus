"use strict";

var algInterface = require("../Algorithm.interface");

function AlgorithmMockup(data) {
  this.data = data;
}

AlgorithmMockup.prototype = Object.create(algInterface);

AlgorithmMockup.prototype.config = function configFunc() {

};

AlgorithmMockup.prototype.execute = function executeFunc() {
  return this.data;
};

module.exports = AlgorithmMockup;