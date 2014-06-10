"use strict";

var _ = require("underscore");

function randomCentroids(data, num, vectorMaxMin) {
  var maxMin = vectorMaxMin || maxMinAttributes(data),
      numAttributes = maxMin.length,
      clusters = [],
      i,j;

  for(i = 0; i < num; i++) {
    clusters[i] = [];
    for(j = 0; j < numAttributes; j++) {
      clusters[i][j] = randomNum(maxMin[j].min, maxMin[j].max);
    }
  }
  return clusters;
}

function maxMinAttributes(data) {
  var numAttributes = data[0].length,
    numInstances = data.length,
    res = [],
    i, j,value;

  for(i = 0; i < numAttributes; i++) {
    res[i] = {};
    value = data[0][i];
    res[i].min = value;
    res[i].max = value;
  }

  for(i = 1; i < numInstances; i++) {
    for(j = 0; j < numAttributes; j++) {
      value = data[i][j];
      if(value > res[j].max) {
        res[j].max = value;
      }

      if(value < res[j].min) {
        res[j].min = value;
      }
    }
  }

  return res;
}

function randomNum(min, max) {
  return _.random(min,max);
}

module.exports = randomCentroids;