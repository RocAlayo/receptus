/**
 * Created by roc on 30/05/14.
 */
"use strict";

var receptus = require("../../lib");

receptus.step(function (dataFile) {
  dataFile.config({
    "path": __dirname + "/data.csv",
    "class-row": 1
  });

  return dataFile.get();
}).step(function ($data, randomCentroids, kmeans, euclideanDistance) {
  var centroids;

  kmeans.config({
    centroids: randomCentroids($data, 3),
    similarity: euclideanDistance,
    convergenceIterations: 5
  });

  centroids =  kmeans.execute($data);

  return {
    centroids: centroids,
    data: $data
  };
}).step(function ($data) {
  var numInstances = [0,0,0];
  $data.data.forEach(function (row) {
    numInstances[row.centroid]++;
  });
  console.log(numInstances);
}).error(function ($error) {
  console.log($error.stack);
});