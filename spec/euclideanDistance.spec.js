/**
 * Created by roc on 01/06/14.
 */
"use strict";

/*global describe */
/*global it */
/*global expect */

var euclideanDistance = require("../lib/algorithms/clustering/similarityWithinRegisters/euclideanDistance");

describe("euclideanDistance", function () {

  it("Error number arguments", function () {

    expect(function () {
      euclideanDistance();
    }).toThrow("Needs 2 arguments to work properly");
  });

  it("Error type arguments: first argument", function () {

    expect(function () {
      euclideanDistance(14, []);
    }).toThrow("Both arguments need to be arrays");
  });

  it("Error type arguments: second argument", function () {

    expect(function () {
      euclideanDistance([], "");
    }).toThrow("Both arguments need to be arrays");
  });

  it("2 arrays with different lengths", function () {
    var reg1 = [10, 5, 15, 76, 90],
      reg2 = [5, 7, 23, 1000];

    expect(function () {
      euclideanDistance(reg1, reg2);
    }).toThrow("Both arguments need to be same size arrays");
  });

  it("with data", function () {
    var reg1 = [10, 5, 15, 76, 90],
        reg2 = [5, 7, 23, 1000, 10],
        res = euclideanDistance(reg1, reg2);

    expect((res - 927.5) < 1).toBeTruthy();
  });
});