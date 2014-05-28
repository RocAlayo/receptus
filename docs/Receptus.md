

<!-- Start /Users/roc/Dropbox/Developer/receptus/lib/Receptus.js -->

Created by roc on 22/05/14.

## Receptus()

# The parser

This is a incredible parser.

    var parser = require("dox-parser")

Dox
Copyright (c) 2010 TJ Holowaychuk <tj@vision-media.ca>
MIT Licensed

## loadDependencies(path)

Will load all the techniques in the file or folder specified.

### Examples:

    stepdip.load("../techs");  // Folder
    stepdip.load("./XMeans");  // File

### Params: 

* **String** *path* File path or folder path, i case of a folder will import all techniques of all files within.

### Return:

* **Boolean** result of the importation of techniques.

## addDependency(id, obj)

Add a dependency to de dependency injector, so when you need it DI will find it for you.
Ids starting with $ are reserved. If used will throw and error.

### Examples:

    stepdip.addDependency("XMeans", Xmeans);  // add Xmeans as a dependency with the name "XMeans"

### Params: 

* **String** *id* Must be a string and will be the name of the dependency.
* **Object** *obj* Value that de DI will use when it needs this dependency.

### Return:

* **Object** Return the previous value of the id specified, if there ara no previous value returns undefined.

## saveStep(id, fn)

Save a step without executing it. If a previous step existed with the same id it will
be returned otherwise will return undefined.

### Examples:

    stepdip.saveStep("removeBlankValues", function (ReplaceValues, $data) {
       //do something
    });

### Params: 

* **String** *id* Must be a string and will be the identificator of the step.
* **Function** *fn* Function that will be called when the step is called by it"s id.

### Return:

* **Object** Return the previous value of the id specified, if there ara no previous value returns undefined.

<!-- End /Users/roc/Dropbox/Developer/receptus/lib/Receptus.js -->

