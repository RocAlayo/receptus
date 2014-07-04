/**
 * Created by roc on 22/05/14.
 */
"use strict";

var fs = require("fs"),
    _ = require("lodash"),
    Promise = require("bluebird"),
    descriptorNW = {
      "writable": false
    },
    descriptorW = {
      "writable": true
    };

/**
 *
 * This is an object that can do a KDD process with different steps
 * an each steps has a Dependency Injection an promises integrated.
 *
 * Author Roc Alayo i Arnabat
 * License MIT
 */
function Receptus(params) {
  var that = this;

  //verifications of arguments
  if(!_.isObject(params)) {
    throw new Error("First argument needs to be an Object");
  }

  _.defaults(params, {
    path: []
  });

  if(_.isString(params.path)) {
    params.path = [ params.path ];
  }

  if(!_.isArray(params.path)) {
    throw new Error("Attribute 'path' of first argument needs to be an Array");
  }

  //creation of object's properties
  this.version = "0.0.1";
  this.resolvedDependencies = [];
  this.dependenciesPaths = [];
  this.savedSteps = [];
  this.promise = new Promise(function (resolve) { resolve(); });

  /** Begin of constructor's logic **/
  params.path.forEach(function (path) {
    that.loadDependencies(path);
  });
  /** End of constructor's logic **/

  //change to no writable all the properties of the object
  Object.defineProperty(this, "version", descriptorNW);
  Object.defineProperty(this, "resolvedDependencies", descriptorNW);
  Object.defineProperty(this, "dependenciesPaths", descriptorNW);
  Object.defineProperty(this, "savedSteps", descriptorNW);
  Object.defineProperty(this, "promise", descriptorNW);
}

/**
 * Will load all the io in the file or folder specified.
 * Permit concatenation to other methods.
 *
 * @param {String} path File path or folder path, i case of a folder will import all io of all files within.
 * @return {Receptus} Return itself.
 */
Receptus.prototype.loadDependencies = function loadDependenciesFunc(path) {
  var exists;

  //verifications
  if (!_.isString(path)) {
    throw new Error("Argument needs to be a string");
  }

  if(path.slice(0,1) === ".") {
    throw new Error("Path needs to be absolute");
  }

  exists = fs.existsSync(path);
  if(!exists) {
    throw new Error("This file or directory doesn't exists");
  }

  //adds all files to dependenciesPaths variable
  getFiles(this, path);

  return this;
};

/**
 *
 * Add all files of 'path' (can be a folder or a file) recursively to obj.dependenciesPaths.
 * Except files with .ni. in it's filename, example: name.ni.js.
 *
 */
function getFiles(obj, path) {
  if(pathIsDirectory(path)) {   // general case of recursive method
    getFilesFolder(path).forEach(function (file) {
      getFiles(obj, file);
    });
  } else if(!path.match(/\.ni\.js$/)) {    // trivial case of recursive function
    Object.defineProperty(obj, "dependenciesPaths", descriptorW);
    obj.dependenciesPaths.push(path);
    Object.defineProperty(obj, "dependenciesPaths", descriptorNW);
  }
}

/**
 *
 * Return all file paths (only if they end with .js) and folder paths in folder 'path'.
 * it's assumed that 'path' is a folder.
 *
 */
function getFilesFolder(path) {
  var paths = [],
      filenames = fs.readdirSync(path),
      i;

  for(i = 0; i < filenames.length; i++) {
    if (filenames[i].match(/\.js$/) || pathIsDirectory(path + "/" + filenames[i])) {
      paths.push(path + "/" + filenames[i]);
    }
  }

  return paths;
}

/**
 *
 * Synchronous chech of path.
 * Return true if path is a folder and false if it's not.
 */
function pathIsDirectory(path) {
  return fs.statSync(path).isDirectory();
}

/**
 *
 * Add a dependency to de dependency injector, so when you need it DI will find it for you.
 * Ids starting with $ are reserved. If used will throw and error.
 *
 *
 * @param {String} id Must be a string and will be the name of the dependency.
 * @param {Object} dep Value that de DI will use when it needs this dependency.
 * @return {Object} Return the previous value of the id specified, if there ara no previous value returns undefined.
 */
Receptus.prototype.addDependency = function addDependencyFunc(id, dep) {
  var prevDep;

  //verifications
  if (!_.isString(id)) {
    throw new Error("First argument needs to be a string");
  }

  id = id.trim();
  if (id.substr(0, 1) === "$") {
    throw new Error("First argument starting by $ are reserved for self use");
  }

  if (_.isNull(dep) || _.isUndefined(dep)) {
    throw new Error("Second argument can't be null or undefined");
  }

  //method's logic
  prevDep = this.resolvedDependencies[id];
  this.resolvedDependencies[id] = dep;
  return prevDep;
};

/**
 *
 * Save a step without executing it. If a previous step existed with the same id it will
 * be returned otherwise will return undefined.
 *
 * @param {String} id Must be a string and will be the identificator of the step.
 * @param {Function} fn Function that will be called when the step is called by it"s id.
 * @return {Object} Return the previous value of the id specified, if there ara no previous value returns undefined.
 * @api public
 */
Receptus.prototype.saveStep = function saveStepFunc(id, fn) {

  //verifications
  if (!_.isString(id)) {
    throw new Error("First argument needs to be a string");
  }

  if(!_.isFunction(fn)) {
    throw new Error("Second argument needs to be a function");
  }

  //method's logic
  id = id.trim();
  var prevStep = this.savedSteps[id];
  this.savedSteps[id] = fn;
  return prevStep;
};


/**
 *
 * Execute a step resolving all dependencies synchronously.
 * This methods has one or two arguments depending of the use needed.
 *
 * (id (string), fn (function))
 *      - execute fn as step and save it with id name.
 * (parallel (boolean), steps (array of strings))
 *      - if parallel is true execute in parallel all steps.
 *      - if parallel is false execute in sequence all steps.
 *      All steps must be previously saved.
 * (fn (function))
 *      - execute fn as a step.
 *
 *
 * Return always self object so it can be concatenated.
 *
 */
Receptus.prototype.step = function stepFunc() {
  var args = Array.prototype.slice.call(arguments),
      id, fn;

  if(conditionOneStep(this, args)) {    // Only one step, saved or not saved
    if(_.isString(args[0]) && _.isFunction(args[1])) {
      id = args[0];
      fn = args[1];
    } else if (_.isString(args[0])) {
      id = args[0];
    } else if (_.isFunction(args[0])) {
      fn = args[0];
    }
    executeOneStep(this,id, fn);
  } else if (conditionMultiSequencialSteps(this, args)) {  //multi sequencial steps
    executeMultiSequencialSteps(this, args[1]);
  } else if (conditionMultiParallelSteps(this, args)) { //multi parallel steps
    executeMultiParallelSteps(this, args[1]);
  } else {
    throw new Error("Wrong number or type of arguments.");
  }

  return this;
};

/**
 *
 * Given an array 'steps' of saved step id's it will execute all in parallel
 * and the previous step value for all steps will be the same.
 *
 */
function executeMultiParallelSteps(obj, steps) {
  // Get all de function callbacks of the array of ids
  steps = getStep(obj, steps);

  // Replace all function callbacks  with a promise originated on the function callbacks
  steps = steps.map(function (fn) {
    return obj.promise.then(getPromiseCallback(obj, fn, "$data", true));
  });

  //create a result promise from all the promises of the array
  Object.defineProperty(obj, "promise", descriptorW);
  obj.promise = Promise.all(steps);
  Object.defineProperty(obj, "promise", descriptorNW);
}

/**
 *
 * Execute all steps in array 'steps' in the same sequence as the array
 *
 */
function executeMultiSequencialSteps(obj, steps) {
  steps.forEach(function (el) {
    obj.step(el);
  });
}

/**
 *
 * Execute a step and save it in case there is an id.
 *
 */
function executeOneStep(obj, id, fn) {
  var thenFunc;

  if(id && fn) {    // If two arguments are used save the step
    obj.saveStep(id, fn);
  } else if (id) {    // If only id is used get the callback from the saved steps
    fn = getStep(obj, id);
  }

  // Get all dependencies injected and get a function for the method .then
  thenFunc = getPromiseCallback(obj, fn, "$data");

  // Execute a new promise with the callback calculated and
  Object.defineProperty(obj, "promise", descriptorW);
  obj.promise = obj.promise.then(thenFunc);
  Object.defineProperty(obj, "promise", descriptorNW);
}

/**
 *
 * Conditions that arguments need to have to execute a single step.
 *
 */
function conditionOneStep(obj, args) {
  //first is the id and second is the callback
  var cond = _.isString(args[0]) && _.isFunction(args[1]) && args.length === 2;
  //callback without id
  cond = cond || _.isFunction(args[0]) && args.length === 1;
  //id without callback
  cond = cond || _.isString(args[0])  && args.length === 1;
  return cond;
}

/**
 *
 * Conditions that arguments need to have to execute sequential multi steps.
 *
 */
function conditionMultiSequencialSteps(obj, args) {
  // First argument is boolean and is false
  var cond = _.isBoolean(args[0]) && !args[0];
  // Second argument is an array
  cond = cond && _.isArray(args[1]) && args.length === 2;
  // All elements in second argument array are strings
  cond =  cond && args[1].every(function (el) {
    return _.isString(el);
  });
  return cond;
}

/**
 *
 * Conditions that arguments need to have to execute parallel multi steps.
 *
 */
function conditionMultiParallelSteps(obj, args) {
  var cond = _.isBoolean(args[0]) && args[0];
  cond = cond && _.isArray(args[1]) && args.length === 2;
  cond =  cond && args[1].every(function (el) {
    return typeof el === "string";
  });
  return cond;
}

/**
 *
 * Get all the saved steps callbacks of array 'step'. 'step' also can be a
 * string so it can only get one callback.
 *
 * Throws an error if any of the ids doesn't have been saved previously.
 * Return an array of callbacks or just the callback if only one steps was passed
 *
 */
function getStep(obj, step) {
  var steps,
      allResolved;

  // If is step put it in steps as an array of one
  if (_.isString(step)) {
    steps = [step];
  } else if (_.isArray(step)) {
    steps = step;
  }

  // Resolve all id with each callback
  steps = steps.map(function (el) {
    return obj.savedSteps[el];
  });

  // Checks if all ids have been resolved
  allResolved = steps.every(function (el) {
    return el;
  });

  if (!allResolved) {
    throw new Error("There is at least one step that doesn't exists.");
  }

  // If 'steps' only have a step return just the one
  if(steps.length === 1) {
    return steps[0];
  }

  return steps;
}

/**
 *
 * Get the dependency with name 'name' if it can't find it will search in saved folders.
 *
 * Return the callback of the corresponding id.
 *
 */
function getDependency(obj, name) {
  var dep = obj.resolvedDependencies[name];

  return dep || findDependencyInFiles(obj,name);
}

/**
 *
 * Parse the function 'fn' to get all the arguments it needs to be executed.
 *
 * Return an array of strings with all the dependencies.
 *
 */
function extractDependencies(fn) {
  var stringFunc = fn.toString(),
    fnArgs = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    depString = stringFunc.match(fnArgs)[1].replace(/ /g, ""),
    res = [];

  if(depString !== "")  {
    res = depString.split(",");
  }

  return res;
}


/**
 *
 * Search dependency 'name' in all saved files for dependencies.
 *
 * If the dependency is a constructor function with no arguments and
 * the function name is the same as the 'name' but with the first letter in uppercase, then
 * this same method will create a new object of the constructor function and save it in
 * the dependencies.
 *
 * This method returns return the dependency if exists a file that has it, otherwise returns 'undefined'.
 *
 */
function findDependencyInFiles(obj, name) {
  // Filter to only the files that their names have some resemblance with 'name'
  var files = obj.dependenciesPaths.filter(function (path) {
        var descomposedPath = path.toLowerCase().split("/"),
            filename = descomposedPath[descomposedPath.length - 1];
        return filename.indexOf(name.toLowerCase()) !== -1;
      });

  // Search in the files selected for the dependency, save it and remove that file from the saved files.
  files.forEach(function (file) {
    var dep = require(file),
        Dep = dep,
        nameDep = getNameDependency(dep),
        nameDepObj;

    // Name of the dependency can't be assessed so we remove the file to remove overhead an skip this loop
    if(_.isNull(nameDep) || _.isUndefined(nameDep)) {
      obj.dependenciesPaths.splice(obj.dependenciesPaths.indexOf(file), 1);
      return;
    }

    nameDepObj = nameDep.slice(0,1).toLowerCase() + nameDep.slice(1);

    if (nameDep.match(/[A-Z][a-zA-Z]*/) && _.isFunction(dep) && extractDependencies(dep).length === 0 && name === nameDepObj) {
      obj.resolvedDependencies[nameDepObj] = new Dep();
    }

    obj.resolvedDependencies[nameDep] = dep;
    obj.dependenciesPaths.splice(obj.dependenciesPaths.indexOf(file), 1);
  });

  return obj.resolvedDependencies[name];
}

/**
 *
 * Get the name of a function.
 *
 */
function getNameDependency(dep) {
  var isFunc = _.isFunction(dep),
      // get the name of the function
      s = isFunc && ((dep.name && ["", dep.name]) || dep.toString().match(/function ([^\(]+)/));

  if (!isFunc) {
    return dep.name;
  }

  return (s && s[1] || null);
}

/**
 *
 * Prepare the callback for method then resolving all the dependencies and if needed
 * getting $data or $error of previous promise.
 *
 * Returns a function that can be passed to the function then of Promise.
 */
function getPromiseCallback(obj, callback, callbackType, clonePreviousArg) {
  var dependenciesStrings = extractDependencies(callback),
      //check the format of the dependencies
      error = !dependenciesStrings.every(function (dep) {
        return dep.slice(0,1) !== "$" || dep === callbackType;
      });

  clonePreviousArg = clonePreviousArg || false;

  if (error && callbackType === "$error") {
    throw new Error("Symbol $ in arguments only can be used with $error");
  }

  // Function that will be the callback to the promise
  return function (returnPrevPromise) {
    // Resolving the dependencies within the promise callback allows
    // for the dependencies to change in the previous steps.
    var dependencies = dependenciesStrings.map(function (dep) {
      var ret;

      //normal dependency that needs to be resolved
      if(dep.charAt(0) !== "$") {
        ret = getDependency(obj, dep);

        if(!ret) {
          throw new Error("Dependency '" + dep + "' doesn't exists");
        }
        return ret;
      }
      //its a special dependency that maybe is $error or $data or a mapped property of a $data plain object.

      // if its demanded clone the content, only used in parallel multisteps
      if(clonePreviousArg && (_.isObject(returnPrevPromise) || _.isArray(returnPrevPromise))) {
        ret = JSON.parse(JSON.stringify(returnPrevPromise));
      } else {
        ret = returnPrevPromise;
      }

      dep = dep.substr(1); //remove character $ from dependency

      if(dep === "error" || dep === "data") {
        return ret;
      } else if (!_.isPlainObject(ret)) { //can't map a non-plain object, it's dangerous.
        throw new Error("Dependency '$" + dep + "' can't be mapped from '$data' if '$data' isn't a plain object");
      }

      if(_.isUndefined(ret[dep])) {
        throw new Error("Dependency '$" + dep + "' can't be mapped from '$data', there is not a property in '$data' with that name");
      }

      return ret[dep];
    });
    // Execute the actual callback with de resolved dependencies
    return callback.apply(obj, dependencies);
  };
}

/**
 *
 * Execute a callback that will capture all the errors from previous steps.
 *
 * Callback can have an argument '$error' that will be populated with the error.
 *
 */
Receptus.prototype.error = function errorFunc(callback) {
  if(!_.isFunction(callback)) {
    throw new Error("Callback has to be a function");
  }

  Object.defineProperty(this, "promise", descriptorW);
  this.promise = this.promise.then(null, getPromiseCallback(this, callback, "$error"));
  Object.defineProperty(this, "promise", descriptorNW);

  return this;
};

// when a Receptus object is created Promise will be available at receptus.Promise
Receptus.prototype.Promise = Promise;
// Whenconsulted directly at constructor function Receptus Promise will be available at Receptus.Promise
Receptus.Promise = Promise;

module.exports =  Receptus;