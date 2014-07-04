/**
 * Created by roc on 22/05/14.
 */
"use strict";

/*global describe */
/*global it */
/*global expect */
/*global beforeEach */
/*global afterEach */


var Receptus = require("../lib/Receptus"),
    kdd;

describe("Receptus.error errors", function () {
  beforeEach(function() {
    kdd = new Receptus({});
  });

  afterEach(function () {
    kdd = null;
  });

  it("Errors - No function argument", function () {
    expect(function () {
      kdd.error(14);
    }).toThrow("Callback has to be a function");
  });

  it("Errors - Unexistent dependency", function (done) {
    kdd.step(function () {
      throw 2;
    }).error(function (foobar) {

    }).error(function ($error) {
      expect($error.message).toBe("Dependency 'foobar' doesn't exists");
      done();
    });
  });

  it("Errors - Only argument reserved is $error", function () {
    expect(function () {
      kdd.error(function ($data) {
      });
    }).toThrow("Symbol $ in arguments only can be used with $error");
  });

  it("Use - $error gets filled correctly", function (done) {
    kdd.step(function () {
      throw new Error("Error!");
    }).error(function ($error) {
      expect($error.message).toBe("Error!");
      done();
    });
  });

  it("Use - Catch error from previous step", function (done) {
    kdd.step(function () {
      throw new Error("error!");
    }).error(function () {
      expect(true).toBeTruthy();
      done();
    });
  });

  it("Use - Resolve dependencies correctly", function (done) {
    kdd.addDependency("foo", function () { return 19; });

    kdd.step(function () {
      throw 2;
    }).error(function (foo, $error) {
      expect(foo() - $error).toBe(17);
      done();
    });
  });

  it("Use - Catch error from previous error", function (done) {
    kdd.step(function () {
      throw 2;
    }).error(function () {
      throw new Error("Error!");
    }).error(function ($error) {
      expect($error.message).toBe("Error!");
      done();
    });
  });
});