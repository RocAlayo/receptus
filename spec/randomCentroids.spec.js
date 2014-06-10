/**
 * Created by roc on 01/06/14.
 */
"use strict";

var randomCentroids = require("../lib/algorithms/clustering/positionOfCentroids/randomCentroids");

/*global describe */
/*global it */
/*global expect */

describe("randomCentroids", function () {
  it("with data", function () {
    var data = [
        [24,2974,38040,704743],
        [2,1592,87209,200333],
        [70,8945,70320,969340],
        [47,4700,10302,893011]
        ],
        centroids = randomCentroids(data, 2),
        res  = centroids.length === 2 && centroids[0].length === 4;

    res = res && centroids.every(function (el) {
      var res = el[0] >= 2 && el[0] <= 70;
      res = res && el[1] >= 1592 && el[1] <= 8945;
      res = res && el[2] >= 10302 && el[2] <= 87209;
      res = res && el[3] >= 200333 && el[3] <= 969340;
      return res;
    });

    expect(res).toBeTruthy();
  });
});