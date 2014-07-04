/**
 * Created by roc on 22/05/14.
 */
"use strict";


var Receptus = require("./Receptus");

Receptus.interfaces = {
  Algorithm: require("./Algorithm.interface"),
  InputData: require("./InputData.interface")
};

Receptus.OutputData = require("./OutputData");

// Freeze an Seal the constructor function Receptus so it can't be modified.
Object.freeze(Receptus);
Object.seal(Receptus);

module.exports = Receptus;