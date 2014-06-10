/**
 * Created by roc on 22/05/14.
 */
"use strict";

/*global describe */
/*global it */
/*global expect */


var Receptus = require("../../lib/Receptus");

describe("Receptus.error errors", function () {
  it("No function argument", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.error(14);
    }).toThrow("Callback has to be a function");
  });

  it("Unexistent dependency", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      throw 2;
    }).error(function (foobar) {

    }).error(function ($error) {
      expect($error.message).toBe("Dependency 'foobar' doesn't exists");
      done();
    });
  });

  it("Only argument reserved is $error", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.error(function ($data) {

      });
    }).toThrow("Symbol $ in arguments only can be used with $error");
  });
});

describe("Receptus.error use", function () {
  it("$error gets filled correctly", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      throw new Error("Error!");
    }).error(function ($error) {
      expect($error.message).toBe("Error!");
      done();
    });
  });

  it("Catch error from previous step", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      throw new Error("error!");
    }).error(function () {
      expect(true).toBeTruthy();
      done();
    });
  });

  it("Resolve dependencies correctly", function (done) {
    var kdd = new Receptus({});

    kdd.addDependency("foo", function () { return 19; });

    kdd.step(function () {
      throw 2;
    }).error(function (foo, $error) {
      expect(foo() - $error).toBe(17);
      done();
    });
  });

  it("Catch error from previous error", function (done) {
    var kdd = new Receptus({});

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