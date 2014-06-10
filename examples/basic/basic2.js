/**
 * Created by roc on 30/05/14.
 */
"use strict";

var receptus = require("../../lib");

receptus.addDependency("numClusters", 5);

receptus.saveStep("kmeans", function ($data, randomCentroids, Kmeans, euclideanDistance, numClusters) {
  var kmeans = new Kmeans(),
    centroids;

  console.log();
  kmeans.config({
    centroids: randomCentroids($data, numClusters),
    similarity: euclideanDistance,
    convergenceIterations: 20
  });

  centroids =  kmeans.execute($data);

  return {
    centroids: centroids,
    data: $data
  };
});

receptus.step(function (dataFile) {
  dataFile.config({
    "path": __dirname + "/data.csv",
    "class-row": 1
  });

  return dataFile.get();
})
.step("kmeans")
.step(function ($data) {
  var numInstances = [0,0,0,0,0],
      numZeros;
  $data.data.forEach(function (row) {
    numInstances[row.centroid]++;
  });

  console.log(numInstances);
  numZeros = numInstances.filter(function (val) {
    return val === 0;
  }).length;

  receptus.addDependency("numClusters", 5 - numZeros);

  return $data.data;
})
.step("kmeans")
.step(function ($data) {
  var numInstances = [0,0,0];

  $data.data.forEach(function (row) {
    numInstances[row.centroid]++;
  });

  console.log(numInstances);
})
.error(function ($error) {
  console.log($error.stack);
});