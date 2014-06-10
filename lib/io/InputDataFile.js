"use strict";

var dataInterface = require("../InputData.interface"),
    fs = require("fs"),
    _ = require("underscore"),
    Receptus = require("../Receptus");

function DataFile() {
  this.params = {};
  this.defaultParams = {
    separator: {
      registre: "\r\n",
      attribute: ","
    }
  };
}

DataFile.prototype = Object.create(dataInterface);

DataFile.prototype.config = function configFunc(params) {
  this.params = _.defaults(params,this.defaultParams);
};

DataFile.prototype.get = function getFunc() {
  var readFile = Receptus.Promise.promisify(fs.readFile),
      that = this;

  return readFile(this.params.path, "utf8").then(function (data) {
    var rows = data.trim().split(that.params.separator.registre),
        names = rows[0].split(that.params.separator.attribute);

    rows = rows.splice(1);
    rows = rows.map(function (row) {
      return row.split(that.params.separator.attribute).map(parseFloat);
    });

    rows.attributes = names;
    return rows;
  });
};

module.exports = DataFile;