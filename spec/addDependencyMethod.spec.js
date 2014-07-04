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

describe("Receptus.addDependency", function () {
  beforeEach(function() {
    kdd = new Receptus({});
  });

  afterEach(function () {
    kdd = null;
  });

  it("Errors - First argument not string", function () {
    var dep = function dep() {};

    expect(function () {
      kdd.addDependency(14, dep);
    }).toThrow("First argument needs to be a string");
  });

  it("Errors - First argument begin by reserved character", function () {
    var dep = function dep() {};

    expect(function () {
      kdd.addDependency("$lol", dep);
    }).toThrow("First argument starting by $ are reserved for self use");
  });

  it("Errors - Second argument null", function () {
    expect(function () {
      kdd.addDependency("lol", null);
    }).toThrow("Second argument can't be null or undefined");
  });

  it("Errors - Second argument undefined", function () {
    expect(function () {
      kdd.addDependency("lol");
    }).toThrow("Second argument can't be null or undefined");
  });

  it("Use - Add function dependency", function () {
    var dep = function dep() {};

    kdd.addDependency("Prova", dep);

    expect(kdd.resolvedDependencies.Prova).toBe(dep);
  });

  it("Use - Add object dependency", function () {
    kdd.addDependency("Prova", {});

    expect(kdd.resolvedDependencies.Prova).toEqual({});
  });

  it("Use - New dependency", function () {
    var dep = function dep() {},
        ret = kdd.addDependency("Prova", dep);

    expect(ret).toBeUndefined();
  });

  it("Use - Dependency with previous value", function () {
    var dep = function dep() {},
        depTwo = function dep2() {},
        ret;

    kdd.addDependency("Prova", dep);
    ret = kdd.addDependency("Prova", depTwo);

    expect(ret).toBe(dep);
  });
});
