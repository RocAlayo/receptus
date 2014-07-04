/**
 * Created by roc on 29/05/14.
 */
"use strict";

/*global describe */
/*global it */
/*global expect */

var Receptus = require("../lib/Receptus");

describe("Receptus.constructor", function () {
  it("Errors - First argument not an object", function () {
    expect(function () {
      var receptus = new Receptus(14);
    }).toThrow("First argument needs to be an Object");
  });

  it("Errors - Path attribute not array", function () {
    expect(function () {
      var receptus = new Receptus({path: 14});
    }).toThrow("Attribute 'path' of first argument needs to be an Array");
  });

  it("Use - Saved string path", function () {
    var kdd = new Receptus({
      path: __dirname + "/bar"
    });

    expect(kdd.dependenciesPaths.length).toBe(4);
  });

  it("Use - Saved array path", function () {
    var kdd = new Receptus({
      path: [__dirname + "/bar"]
    });

    expect(kdd.dependenciesPaths.length).toBe(4);
  });
});