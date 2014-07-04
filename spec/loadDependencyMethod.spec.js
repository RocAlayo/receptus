/**
 * Created by roc on 29/05/14.
 */
"use strict";

/*global describe */
/*global it */
/*global expect */
/*global beforeEach */
/*global afterEach */


var Receptus = require("../lib/Receptus"),
    kdd;


describe("Receptus.loadDependencies", function () {
  beforeEach(function() {
    kdd = new Receptus({});
  });

  afterEach(function () {
    kdd = null;
  });

  it("Errors - Type of argument", function () {
    expect(function () {
      kdd.loadDependencies(14);
    }).toThrow("Argument needs to be a string");
  });

  it("Errors - Path not absolute", function () {
    expect(function () {
      kdd.loadDependencies("./foo");
    }).toThrow("Path needs to be absolute");
  });

  it("Errors - Folder or file non-existent", function () {
    expect(function () {
      kdd.loadDependencies(__dirname + "/foo");
    }).toThrow("This file or directory doesn't exists");
  });

  it("Use - Saved path of a specific file", function () {
    kdd.loadDependencies(__dirname + "/bar");
    expect(kdd.dependenciesPaths).toContain(__dirname + "/bar/foo.js");
  });

  it("Use - Saved paths and no .ni.js", function () {
    kdd.loadDependencies(__dirname + "/bar");

    expect(kdd.dependenciesPaths.length).toBe(4);
  });

  it("Use - lazy load dependencies", function () {
    kdd.loadDependencies(__dirname + "/bar");

    expect(kdd.resolvedDependencies).toEqual([]);
  });
});