/**
 * Created by roc on 22/05/14.
 */
'use strict';


var receptus = require('../lib');

// this loads are async and their contructors will be loaded when need (lazyload).
receptus.loadDependencies(__dirname + './xmeans');     // File
receptus.loadDependencies(__dirname + '/preproces.js');  // Folder

receptus.step(function ($data, DataFile) {
  var dataFile = new DataFile({
    "path": "./dades.txt",
    "row_separator": "\n",
    "column_separator": "\t"
  });

  return dataFile.get(); //return a promise
});

/*
 with an string as first param you can save this
 step so you can execute it again with that single name
 */
receptus.step("repBlankVal", function ($data, ReplaceValues) {
  var blankValues = new ReplaceValues({
    "condition": ReplaceValues.condition.emptyString,
    "action": ReplaceValues.action.removeRow
  });

  return blankValues.execute($data); // this method a sync function
})
.step(function ($data, ReplaceValues) {
  var nullValues = new ReplaceValues({
    "condition": ReplaceValues.condition.nullValue,
    "action": ReplaceValues.action.removeRow
  });

  return nullValues.execute($data);
})
.step("repBlankVal");