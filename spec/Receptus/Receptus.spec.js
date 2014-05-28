/**
 * Created by roc on 22/05/14.
 */
"use strict";

/*global describe */
/*global it */
/*global expect */


var Receptus = require("../../lib/Receptus"),
    Promise = require("bluebird");

/********************************************************************************/
describe("StepDip function addDependency", function () {
  it("add new dependency and exists", function () {
    var kdd = new Receptus({}),
        dep = function dep() {};
    kdd.addDependency("Prova", dep);

    expect(kdd.resolvedDependencies.Prova).toBe(dep);
  });

  it("add new dependency and returns undefined", function () {
    var kdd = new Receptus({}),
        dep = function dep() {},
        ret = kdd.addDependency("Prova", dep);

    expect(ret).toBeUndefined();
  });

  it("modify dependency and returns previous one", function () {
    var kdd = new Receptus({}),
        dep = function dep() {},
        depTwo = function dep2() {},
        ret;

    kdd.addDependency("Prova", dep);
    ret = kdd.addDependency("Prova", depTwo);

    expect(ret).toBe(dep);
  });

  it("throws error because id isn't a string", function () {
    var kdd = new Receptus({}),
        dep = function dep() {};

    expect(function () {
      kdd.addDependency(14, dep);
    }).toThrow("id needs to be a string.");
  });

  it("throws error because id with $ are reserved", function () {
    var kdd = new Receptus({}),
      dep = function dep() {};

    expect(function () {
      kdd.addDependency("$lol", dep);
    }).toThrow("Ids starting by $ are reserved for self use.");
  });
});

/********************************************************************************/
describe("StepDip function loadDependencies", function () {
  it("Argument isnt a string", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.loadDependencies(14);
    }).toThrow("Argument needs to be a string.");
  });

  it("Path not absolute", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.loadDependencies("./foo");
    }).toThrow("Path needs to be absolute.");
  });

  it("Folder or file non-existent", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.loadDependencies(__dirname + "/foo");
    }).toThrow("This file or directory doesn't exists.");
  });

  it("Folder with one file", function () {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");
    expect(kdd.dependenciesPaths).toContain(__dirname + "/bar/foo.js");
  });

  it("lazy load file", function () {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    expect(kdd.resolvedDependencies).toEqual([]);
  });

  it("loaded path", function () {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    expect(kdd.dependenciesPaths.length).toBe(2);
  });

  it("loaded path with new StepDip", function () {
    var kdd = new Receptus({
      path: __dirname + "/bar"
    });

    expect(kdd.dependenciesPaths.length).toBe(2);
  });
});


/********************************************************************************/
describe("StepDip function saveStep", function () {
  it("save step correctly", function () {
    var kdd = new Receptus({}),
        step = function step() {};
    kdd.saveStep("step1", step);

    expect(kdd.savedSteps["step1"]).toBe(step);
  });

  it("save step with no prior value", function () {
    var kdd = new Receptus({}),
      step = function step() {},
      ret = kdd.saveStep("step1", step);

    expect(ret).toBeUndefined();
  });

  it("modify dependency and returns previous one", function () {
    var kdd = new Receptus({}),
        step = function step() {},
        stepTwo = function step() {},
        ret;

    kdd.addDependency("step1", step);
    ret = kdd.addDependency("step1", stepTwo);

    expect(ret).toBe(step);
  });

  it("throws error because id isn't a string", function () {
    var kdd = new Receptus({}),
        step = function step() {};

    expect(function () {
      kdd.saveStep(14, step);
    }).toThrow("id needs to be a string.");
  });
});

/********************************************************************************/
describe("StepDip function step", function () {
  it("Error 0 arguments", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step();
    }).toThrow("this function needs at least one parameter.");
  });

  it("Error 1 arguments: wrong type", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step(14);
    }).toThrow("this param needs to either a function or an string.");
  });

  it("Error 1 arguments: dont exists", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step("step1");
    }).toThrow("there isn't any step saved with that id.");
  });

  it("Error 2 arguments: id wrong type", function () {
    var kdd = new Receptus({}),
      step = function step() {};

    expect(function () {
      kdd.step(14, step);
    }).toThrow("id needs to be a string.");
  });

  it("Error 2 arguments: callback wrong type", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step("step1", 14);
    }).toThrow("callback needs to be a function");
  });

  it("Error N arguments: firsts arg isnt a bool", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step(14,"stepA","stepB");
    }).toThrow("First argument needs to be a boolean.");
  });

  it("Resolve step without dependencies", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      return "foo";
    });

    kdd.promise.then(function resPromise(res) {
      expect(res).toBe("foo");
      done();
    });
  });

  it("Resolve step with dependencies", function (done) {
    var kdd = new Receptus({});

    kdd.addDependency("foo", function foo() { return 14; });
    kdd.addDependency("bar", function bar() { return 2; });

    kdd.step(function (foo, bar) {
      return foo() - bar();
    });

    kdd.promise.then(function resPromise(result) {
      expect(result).toBe(12);
      done();
    });
  });

  it("Resolve step with $data", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      return 28;
    }).step(function ($data) {
      expect($data).toBe(28);
      done();
    });
  });

  it("Resolve step with param $help", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step(function ($help) {

      });
    }).toThrow("the $ only can be used by $data and $error.");
  });

  it("Step return a promise", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      return 14;
    }).step(function () {
      return new Promise(function (resolve) { resolve(28); });
    }).step(function ($data) {
        expect($data).toBe(28);
        done();
      });
  });

  it("Dependency not found", function (done) {
    var kdd = new Receptus({});

    kdd.step(function (bar) {

    }).error(function ($error) {
        expect($error).toBe("Dependency 'bar' doesn't exists.");
        done();
      });
  });

  it("Lazy load wrong dependency: dependency loaded", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (fo) {

    }).error(function () {
        expect(kdd.resolvedDependencies).not.toEqual([]);
        done();
      });
  });

  it("Lazy load wrong dependency: file path removed", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (fo) {

    }).error(function () {
        expect(kdd.dependenciesPaths.length).toEqual(1);
        done();
      });
  });

  it("Lazy load right dependency: saved", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (foo) {
      expect(this.resolvedDependencies.foo).toBe(foo);
      done();
    });
  });

  it("Lazy load right dependency with folder: use it", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (foo) {
      expect(foo()).toBe(15);
      done();
    });
  });

  it("Lazy load right dependency with file: use it", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar/foo.js");

    kdd.step(function (foo) {
      expect(foo()).toBe(15);
      done();
    });
  });

  it("Lazy load right dependency with file: use it recursive", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (Test) {
      var test = new Test();
      expect(test.doIt()).toBe(16);
      done();
    });
  });

  it("Multi steps in sequence", function (done) {
    var kdd = new Receptus({});

    kdd.addDependency("dep", function () {
      return 2;
    });

    kdd.saveStep("step1", function () { return 7; });
    kdd.saveStep("step2", function ($data) { return 10 - $data; });
    kdd.saveStep("step3", function (dep, $data) { return (10 * dep()) - $data; });

    kdd.step(false, "step1", "step2", "step3").step(function ($data) {
      expect($data).toBe(17);
      done();
    });
  });

  it("Multi steps in parallel", function (done) {
    var kdd = new Receptus({});

    kdd.addDependency("dep", function () {
      return 2;
    });

    kdd.saveStep("step1", function ($data) { return 7 + $data; });
    kdd.saveStep("step2", function ($data) { return 10 / $data; });
    kdd.saveStep("step3", function (dep, $data) { return $data * dep(); });

    kdd.step(function () {
      return 5;
    }).step(true, "step1", "step2", "step3").step(function ($data) {
        var res = $data.reduce(function(previousValue, currentValue){
          return previousValue - currentValue;
        });
        expect(res).toBe(0);
        done();
      });
  });

  it("Error in multi steps in parallel", function () {
    var kdd = new Receptus({});

    kdd.saveStep("step2", function ($data) { return 10 / $data; });

    expect(function () {
      kdd.step(function () {
        return 5;
      }).step(true, "step1", "step2").step(function () {

      });
    }).toThrow("There is at least one step that doesnt exists.");
  });

  it("Multi steps in parallel: Throw in one step", function (done) {
    var kdd = new Receptus({});

    kdd.saveStep("step1", function ($data) { return 10 / $data; });
    kdd.saveStep("step2", function () { throw "error!"; });

    kdd.step(function () {
      return 5;
    }).step(true, "step1", "step2").error(function ($error) {
      expect($error).toBe("error!");
      done();
  });
  });
});


/********************************************************************************/
describe("StepDip function error", function () {
  it("With a params thats not a function", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.error(14);
    }).toThrow("Callback has to be a function.");
  });


  it("Reject with $error filled", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      throw 14;
    }).error(function ($error) {
      expect($error).toBe(14);
      done();
    });
  });


  it("Catch an error from previous step", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      throw "error!";
    }).error(function ($error) {
        expect($error).toBe("error!");
        done();
      });
  });


  it("Catch an error from previous step", function (done) {
    var kdd = new Receptus({});

    kdd.addDependency("foo", function () { return 19; });

    kdd.step(function () {
      throw 2;
    }).error(function (foo, $error) {
      expect(foo() - $error).toBe(17);
      done();
    });
  });
});