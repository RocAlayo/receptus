"use strict";

var algInterface = require("../../Algorithm.interface.js"),
    _ = require("underscore");

function Kmeans() {
  this.params = {};
  this.defaultParams = {
    centroids: [], //function (data, centroids, minMaxArray) {},
    similarity: function (register1, register2) {},
    convergenceIterations: 2
  };
}

Kmeans.prototype = Object.create(algInterface);

Kmeans.prototype.config = function configFunc(params) {
  this.params = _.defaults(params,this.defaultParams);
};

Kmeans.prototype.execute = function executeFunc(data) {
  var centroidsAct,
      centroids = this.params.centroids,
      convergence = this.params.convergenceIterations;

  while(convergence > 0) {
    data = assignCentroid(data, centroids, this.params.similarity);
    centroidsAct = recalculateCentroids(data, this.params.centroids.length);
    if (equalCentroids(centroids, centroidsAct)) {
      convergence--;
    } else {
      convergence = this.params.convergenceIterations;
    }
    centroids = centroidsAct;
  }
  return centroids;
};

function assignCentroid(data, centroids, funcSimilarity) {
  var i, j,
      similarities = [],
      selectClosestCentroid = function (indexAnt, act, index, array) {
        return array[indexAnt] < act ? indexAnt : index;
      };

  for(i = 0; i < data.length; i++) {
    similarities[i] = [];
    for(j = 0; j < centroids.length; j++) {
      similarities[i][j] = funcSimilarity(centroids[j], data[i]);
    }
  }

  for(i = 0; i < data.length; i++) {
    data[i].centroid = similarities[i].reduce(selectClosestCentroid, 0);
  }

  return data;
}

function recalculateCentroids(data, num) {
  var centroids = [],
      i, j;

  //initialize array
  for(i = 0; i < num; i++) {
    centroids[i] = [];
    for(j = 0; j < data[0].length; j++) {
      centroids[i][j] = 0;
    }
  }

  // adding all rows attributes to the centroids where they belong
  for(i = 0; i < data.length; i++) {
    for(j = 0; j < data[i].length; j++) {
      centroids[data[i].centroid][j] += data[i][j];
    }
  }

  // dividing all attributes of the centroids for the number of rows
  // to get the average attributes of each centroid
  for(i = 0; i < num; i++) {
    for(j = 0; j < data[0].length; j++) {
      centroids[i][j] /= data.length;
    }
  }

  return centroids;
}

function equalCentroids(centroids1, centroids2) {
  var i, j, res = true;
  for(i = 0; i < centroids1.length; i++) {
    for(j = 0; j < centroids1[i].length; j++) {
      // add a tolerance of 0.01 for the decimals
      res = res && (centroids1[i][j] - centroids2[i][j]) < 0.01;
    }
  }
  return res;
}

module.exports = Kmeans;