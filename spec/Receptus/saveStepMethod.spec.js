"use strict";

/*global describe */
/*global it */
/*global expect */

var Receptus = require("../../lib/Receptus");


describe("Receptus.saveStep error", function () {
  it("First argument has to be a string", function () {
    var kdd = new Receptus({}),
      step = function step() {};

    expect(function () {
      kdd.saveStep(14, step);
    }).toThrow("First argument needs to be a string");
  });

  it("Second argument has to be a function", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.saveStep("prova", {});
    }).toThrow("Second argument needs to be a function");
  });
});

describe("Receptus.saveStep use", function () {
  it("save step correctly", function () {
    var kdd = new Receptus({}),
      step = function step() {};
    kdd.saveStep("step1", step);

    expect(kdd.savedSteps["step1"]).toBe(step);
  });

  it("save step with no prior value", function () {
    var kdd = new Receptus({}),
      step = function step() {},
      ret = kdd.saveStep("step1", step);

      expect(ret).toBeUndefined();
  });

  it("modify dependency and returns previous one", function () {
    var kdd = new Receptus({}),
      step = function step() {},
      stepTwo = function step() {},
      ret;

    kdd.addDependency("step1", step);
    ret = kdd.addDependency("step1", stepTwo);

    expect(ret).toBe(step);
  });
});
