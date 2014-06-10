"use strict";

var algInterface = require("../Algorithm.interface.js"),
    _ = require("underscore");

function ReplaceValues() {
  this.params = {
    input: {
      type: "value", //value or regexp or function
      value: "",
      where: "*"
    },
    output: {
      type: "value", //value or function
      value: ""
    }

  };
}

ReplaceValues.prototype = Object.create(algInterface);

ReplaceValues.prototype.config = function configFunc(params) {
  _.defaults(params, this.params);

  this.params = params;
};

ReplaceValues.prototype.execute = function executeFunc(data) {

};

module.exports = ReplaceValues;