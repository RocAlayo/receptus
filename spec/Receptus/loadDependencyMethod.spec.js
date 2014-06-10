/**
 * Created by roc on 29/05/14.
 */
"use strict";

/*global describe */
/*global it */
/*global expect */


var Receptus = require("../../lib/Receptus");


describe("Receptus.loadDependencies errors", function () {
  it("Type of argument", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.loadDependencies(14);
    }).toThrow("Argument needs to be a string");
  });

  it("Path not absolute", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.loadDependencies("./foo");
    }).toThrow("Path needs to be absolute");
  });

  it("Folder or file non-existent", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.loadDependencies(__dirname + "/foo");
    }).toThrow("This file or directory doesn't exists");
  });
});


describe("Receptus.loadDependencies use", function () {
  it("Saved path of a specific file", function () {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");
    expect(kdd.dependenciesPaths).toContain(__dirname + "/bar/foo.js");
  });

  it("Saved paths and no .ni.js", function () {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    expect(kdd.dependenciesPaths.length).toBe(4);
  });

  it("lazy load dependencies", function () {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    expect(kdd.resolvedDependencies).toEqual([]);
  });
});