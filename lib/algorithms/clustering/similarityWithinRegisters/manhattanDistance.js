"use strict";

var _ = require("underscore"),
  math = require("mathjs")();

function manhattanDistance(register1, register2) {
  var res = 0,
      i;

  if(arguments.length < 2) {
    throw new Error("Needs 2 arguments to work properly");
  }

  if(!_.isArray(register1) || !_.isArray(register2)) {
    throw new Error("Both arguments need to be arrays");
  }

  if(register1.length !== register2.length) {
    throw new Error("Both arguments need to be same size arrays");
  }

  for(i = 0; i < register1.length; i++) {
    res += math.abs(register1[i] - register2[i]);
  }

  return res;
}

module.exports = manhattanDistance;