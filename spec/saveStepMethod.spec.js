"use strict";

/*global describe */
/*global it */
/*global expect */
/*global beforeEach */
/*global afterEach */

var Receptus = require("../lib/Receptus"),
    kdd;


describe("Receptus.saveStep", function () {
  beforeEach(function() {
    kdd = new Receptus({});
  });

  afterEach(function () {
    kdd = null;
  });

  it("Errors - First argument has to be a string", function () {
    var step = function step() {};

    expect(function () {
      kdd.saveStep(14, step);
    }).toThrow("First argument needs to be a string");
  });

  it("Errors - Second argument has to be a function", function () {
    expect(function () {
      kdd.saveStep("prova", {});
    }).toThrow("Second argument needs to be a function");
  });

  it("Use - save step correctly", function () {
    var step = function step() {};

    kdd.saveStep("step1", step);
    expect(kdd.savedSteps["step1"]).toBe(step);
  });

  it("Use - save step with no prior value", function () {
    var step = function step() {},
        ret = kdd.saveStep("step1", step);

      expect(ret).toBeUndefined();
  });

  it("Use - modify dependency and returns previous one", function () {
    var step = function step() {},
        stepTwo = function step() {},
        ret;

    kdd.addDependency("step1", step);
    ret = kdd.addDependency("step1", stepTwo);

    expect(ret).toBe(step);
  });
});
