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
    Promise = require("bluebird");

module.exports = new Receptus(new Promise(function (resolve) { resolve(); }), {
  "path": __dirname + "/techniques/"
});