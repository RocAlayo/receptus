/**
 * Created by roc on 29/05/14.
 */
"use strict";

/*global describe */
/*global it */
/*global expect */


var Receptus = require("../../lib/Receptus");


describe("Receptus.addDependency Errors", function () {
  it("First argument not string", function () {
    var kdd = new Receptus({}),
      dep = function dep() {};

    expect(function () {
      kdd.addDependency(14, dep);
    }).toThrow("First argument needs to be a string");
  });

  it("First argument begin by reserved character", function () {
    var kdd = new Receptus({}),
      dep = function dep() {};

    expect(function () {
      kdd.addDependency("$lol", dep);
    }).toThrow("First argument starting by $ are reserved for self use");
  });

  it("Second argument null", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.addDependency("lol", null);
    }).toThrow("Second argument can't be null or undefined");
  });

  it("Second argument undefined", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.addDependency("lol");
    }).toThrow("Second argument can't be null or undefined");
  });
});


describe("Receptus.addDependency use", function () {
  it("Add function dependency", function () {
    var kdd = new Receptus({}),
      dep = function dep() {};
    kdd.addDependency("Prova", dep);

    expect(kdd.resolvedDependencies.Prova).toBe(dep);
  });

  it("Add object dependency", function () {
    var kdd = new Receptus({});
    kdd.addDependency("Prova", {});

    expect(kdd.resolvedDependencies.Prova).toEqual({});
  });

  it("New dependency", function () {
    var kdd = new Receptus({}),
      dep = function dep() {},
      ret = kdd.addDependency("Prova", dep);

    expect(ret).toBeUndefined();
  });

  it("Dependency with previous value", function () {
    var kdd = new Receptus({}),
      dep = function dep() {},
      depTwo = function dep2() {},
      ret;

    kdd.addDependency("Prova", dep);
    ret = kdd.addDependency("Prova", depTwo);

    expect(ret).toBe(dep);
  });
});
