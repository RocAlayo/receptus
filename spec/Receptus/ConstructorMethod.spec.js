/**
 * Created by roc on 29/05/14.
 */
"use strict";

/*global describe */
/*global it */
/*global expect */


var Receptus = require("../../lib/Receptus");


describe("Receptus.constructor errors", function () {
  it("First argument not an object", function () {
    expect(function () {
      var receptus = new Receptus(14);
    }).toThrow("First argument needs to be an Object");
  });

  it("Path attribute not array", function () {
    expect(function () {
      var receptus = new Receptus({path: 14});
    }).toThrow("Attribute 'path' of first argument needs to be an Array");
  });
});


describe("Receptus.constructor use", function () {

  it("Saved string path", function () {
    var kdd = new Receptus({
      path: __dirname + "/bar"
    });

    expect(kdd.dependenciesPaths.length).toBe(4);
  });

  it("Saved array path", function () {
    var kdd = new Receptus({
      path: [__dirname + "/bar"]
    });

    expect(kdd.dependenciesPaths.length).toBe(4);
  });
});