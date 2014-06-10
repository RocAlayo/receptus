/**
 * Created by roc on 30/05/14.
 */
"use strict";

var receptus = require("../../lib");

receptus.saveStep("kmeans", function ($data, randomCentroids, Kmeans, euclideanDistance) {
  var kmeans = new Kmeans(),
    centroids;

  console.log();
  kmeans.config({
    centroids: randomCentroids($data, 5),
    similarity: euclideanDistance,
    convergenceIterations: 10
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
}).step(true, ["kmeans","kmeans", "kmeans"]).step(function ($data) {
  var numInstances;

  $data.forEach(function (result) {
    numInstances = [0,0,0,0,0];
    result.data.forEach(function (row) {
      numInstances[row.centroid]++;
    });
    console.log(numInstances);
  });
}).error(function ($error) {
  console.log($error.stack);
});