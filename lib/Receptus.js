/**
 * Created by roc on 22/05/14.
 */
"use strict";

var fs = require("fs"),
    _ = require("underscore"),
    Promise = require("bluebird"),
    descriptorNW = {
      "writable": false
    },
    descriptorW = {
      "writable": true
    };

/**
 * # The parser
 *
 * This is a incredible parser.
 *
 *     var parser = require("dox-parser")
 *
 * Dox
 * Copyright (c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

function Receptus(params) {
  var that = this;

  this.version = "0.0.1";
  this.resolvedDependencies = [];
  this.dependenciesPaths = [];
  this.savedSteps = [];
  this.promise = new Promise(function (resolve) { resolve(); });

  _.defaults(params, {
    path: [],
    sprinkles: "lots"
  });

  if(typeof params.path === "string") {
    params.path = [ params.path ];
  }

  params.path.forEach(function (path) {
    that.loadDependencies(path);
  });

  Object.defineProperty(this, "version", descriptorNW);
  Object.defineProperty(this, "resolvedDependencies", descriptorNW);
  Object.defineProperty(this, "dependenciesPaths", descriptorNW);
  Object.defineProperty(this, "savedSteps", descriptorNW);
  Object.defineProperty(this, "promise", descriptorNW);
}

/**
 * Will load all the techniques in the file or folder specified.
 *
 * ### Examples:
 *
 *     stepdip.load("../techs");  // Folder
 *     stepdip.load("./XMeans");  // File
 *
 * @param {String} path File path or folder path, i case of a folder will import all techniques of all files within.
 * @return {Boolean} result of the importation of techniques.
 * @api public
 */
Receptus.prototype.loadDependencies = function loadDependenciesFunc(path) {
  var exists;

  if (typeof path !== "string") {
    throw "Argument needs to be a string.";
  }

  if(path.slice(0,1) === ".") {
    throw "Path needs to be absolute.";
  }

  exists = fs.existsSync(path);
  if(!exists) {
    throw "This file or directory doesn't exists.";
  }

  Object.defineProperty(this, "dependenciesPaths", descriptorW);
  getFiles(this, path);
  //this.dependenciesPaths = this.dependenciesPaths.concat(files);
  Object.defineProperty(this, "dependenciesPaths", descriptorNW);

  return this;
};

function getFiles(obj, path) {
  if(pathIsDirectory(path)) {
    getFilesFolder(path).forEach(function (file) {
      getFiles(obj, file);
    });
  } else {
    obj.dependenciesPaths.push(path);
  }
}

function getFilesFolder(path) {
  return fs.readdirSync(path).map(function (file) {
    if (file.match(/\.js$/)) {
      return path + "/" + file;
    } else if (pathIsDirectory(path + "/" + file)) {
      return path + "/" + file;
    }
    return "";
  }).filter(function (file) {
    return file !== "";
  });
}

function pathIsDirectory(path) {
  var stat = fs.statSync(path);
  return stat.isDirectory();
}

/**
 * Add a dependency to de dependency injector, so when you need it DI will find it for you.
 * Ids starting with $ are reserved. If used will throw and error.
 *
 * ### Examples:
 *
 *     stepdip.addDependency("XMeans", Xmeans);  // add Xmeans as a dependency with the name "XMeans"
 *
 * @param {String} id Must be a string and will be the name of the dependency.
 * @param {Object} obj Value that de DI will use when it needs this dependency.
 * @return {Object} Return the previous value of the id specified, if there ara no previous value returns undefined.
 * @api public
 */
Receptus.prototype.addDependency = function addDependencyFunc(id, obj) {
  var prevDep;
  if (typeof id !== "string") {
    throw "id needs to be a string.";
  }
  id = id.trim();
  if (id.substr(0, 1) === "$") {
    throw "Ids starting by $ are reserved for self use.";
  }
  prevDep = this.resolvedDependencies[id];
  this.resolvedDependencies[id] = obj;
  return prevDep;
};

/**
 * Save a step without executing it. If a previous step existed with the same id it will
 * be returned otherwise will return undefined.
 *
 * ### Examples:
 *
 *     stepdip.saveStep("removeBlankValues", function (ReplaceValues, $data) {
 *        //do something
 *     });
 *
 * @param {String} id Must be a string and will be the identificator of the step.
 * @param {Function} fn Function that will be called when the step is called by it"s id.
 * @return {Object} Return the previous value of the id specified, if there ara no previous value returns undefined.
 * @api public
 */
Receptus.prototype.saveStep = function saveStepFunc(id, fn) {
  if (typeof id !== "string") {
    throw "id needs to be a string.";
  }
  id = id.trim();
  var prevStep = this.savedSteps[id];
  this.savedSteps[id] = fn;
  return prevStep;
};

Receptus.prototype.step = function stepFunc() {
  var stepType = selectStepType.apply(this, Array.prototype.slice.call(arguments)),
      thenFunc,
      that = this,
      arrayCallbacks,
      allFn = false;

  //execute multiple steps in sequence
  if (stepType.multi && !stepType.parallel) {
    stepType.steps.forEach(function (element) {
      that.step(element);
    });

    return this;
  }

  //execute multiple steps in parallel
  if (stepType.multi && stepType.parallel) {
    arrayCallbacks = stepType.steps.map(function (step) {
      var fn = that.savedSteps[step];

      if(fn) {
        return Promise.cast(that.promise).then(getPromiseCallback(that, fn));
      } else {
        return null;
      }
    });

    allFn = arrayCallbacks.every(function (fn) {
      return fn;
    });

    if(!allFn) {
      throw "There is at least one step that doesnt exists.";
    }

    Object.defineProperty(this, "promise", descriptorW);
    this.promise = Promise.all(arrayCallbacks);
    Object.defineProperty(this, "promise", descriptorNW);

    return this;
  }

  //execute a step and save it in case there is an id
  if(stepType.id) {
    this.saveStep(stepType.id, stepType.callback);
  }

  thenFunc = getPromiseCallback(this, stepType.callback);
  Object.defineProperty(this, "promise", descriptorW);
  this.promise = this.promise.then(thenFunc);
  Object.defineProperty(this, "promise", descriptorNW);

  return this;
};

function getDependency(obj, name) {
  var dep = obj.resolvedDependencies[name];

  return dep || findDependencyInFiles(obj,name);
}

function selectStepType(obj) {
  var ret = {
      "id": null,
      "callback": null,
      "steps": [],
      "multi": false,
      "parallel": false
    },
    args = Array.prototype.slice.call(arguments, 1, arguments.length),
    allString;

  switch(args.length) {
    case 0:
      throw "this function needs at least one parameter.";
    case 1:
      //function with a single step or id of a step
      if(typeof args[0] === "function") {
        ret.callback = args[0];
        break;
      }

      if(typeof args[0] === "string") {
        ret.callback = savedSteps[args[0]];
        if(!ret.callback) {
          throw "there isn't any step saved with that id.";
        }
        break;
      }
      throw "this param needs to either a function or an string.";
    case 2:
      //id and callback: step will be executed and saved for latter.
      ret.id = args[0];
      ret.callback = args[1];
      if (typeof ret.id !== "string") {
        throw "id needs to be a string.";
      }

      if(typeof ret.callback !== "function") {
        throw "callback needs to be a function";
      }
      break;
    default:
      //array of saved steps that will be executed sequencialy
      ret.multi = true;

      if(typeof args[0]  === "boolean") {
        ret.parallel = args[0];
      } else {
        throw "First argument needs to be a boolean.";
      }

      //need to save values to steps
      ret.steps = args.slice(1);
      allString = ret.steps.every(function (element) {
        return typeof element === "string";
      });

      if (!allString) {
        throw "In multi steps all components need to be strings.";
      }
  }

  return ret;
}

function extractDependencies(fn) {
  var stringFunc = fn.toString(),
    fnArgs = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    depString = stringFunc.match(fnArgs)[1].replace(/ /g, ""),
    res = [];

  if(depString.trim() !== "")  {
    res = depString.split(",");
  }

  return res;
}

function findDependencyInFiles(obj, name) {
  var files = obj.dependenciesPaths.filter(function (path) {
        var descomposedPath = path.split("/"),
            filename = descomposedPath[descomposedPath.length - 1];
        return filename.indexOf(name) !== -1 || filename.indexOf(name.toLowerCase()) !== -1;
      });

  files.forEach(function (file) {
    var dep = require(file),
        nameDep = getNameDependency(dep);

    obj.resolvedDependencies[nameDep] = dep;
    obj.dependenciesPaths.splice(obj.dependenciesPaths.indexOf(file), 1);
  });

  return obj.resolvedDependencies[name];
}

function getNameDependency(dep) {
  var f = (typeof dep === "function"),
      s = f && ((dep.name && ["", dep.name]) || dep.toString().match(/function ([^\(]+)/));

  if (!f) {
    return dep.name;
  }

  return (s && s[1] || "anonymous");
}

function getPromiseCallback(refObject, callback) {
  var dependenciesStrings = extractDependencies(callback),
      error = !dependenciesStrings.every(function (dep) {
        return dep.slice(0,1) !== "$" || dep === "$data" || dep === "$error";
      });

  if (error) {
    throw "the $ only can be used by $data and $error.";
  }

  return function (returnPrevPromise) {
    var dependencies = dependenciesStrings.map(function (dep) {
          var ret;

          switch (dep) {
            case "$data":
            case "$error":
              ret = returnPrevPromise;
              break;
            default:
              ret = getDependency(refObject, dep);

              if(!ret) {
                throw "Dependency '" + dep + "' doesn't exists.";
              }
          }

          return ret;
        });

    return callback.apply(refObject, dependencies);
  };
}


Receptus.prototype.error = function errorFunc(callback) {
  if(typeof callback !== "function") {
    throw "Callback has to be a function.";
  }

  Object.defineProperty(this, "promise", descriptorW);
  this.promise = this.promise.then(null,getPromiseCallback(this, callback));
  Object.defineProperty(this, "promise", descriptorNW);

  return this;
};

Object.freeze(Receptus);
Object.seal(Receptus);
module.exports =  Receptus;
