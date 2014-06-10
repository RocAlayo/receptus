/**
 * Created by roc on 22/05/14.
 */
"use strict";


/**
 * # The parser
 *
 * This is a incredible parser.
 *
 *     var parser = require("dox-parser")
 *
 * Dox
 * Copyright (c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */


var Receptus = require("./Receptus"),
    receptus = new Receptus({
      "path": [
        __dirname + "/io/",
        __dirname + "/utils/",
        __dirname + "/algorithms/"
      ]
    });

receptus.interfaces = {
  Algorithm: require("./Algorithm.interface"),
  InputData: require("./InputData.interface")
};

receptus.mockups = {
  Algorithm: require("./mockups/Algorithm.mockup"),
  InputData: require("./mockups/InputData.mockup")
};

module.exports = receptus;