/**
 * Created by roc on 22/05/14.
 */
"use strict";

/*global describe */
/*global it */
/*global expect */


var Receptus = require("../../lib/Receptus");


describe("Receptus.step errors", function () {
  it("0 arguments", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step();
    }).toThrow("Wrong number or type of arguments.");
  });

  it("1 arguments: wrong type", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step(14);
    }).toThrow("Wrong number or type of arguments.");
  });

  it("1 arguments: dont exists step", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step("step1");
    }).toThrow("There is at least one step that doesn't exists.");
  });

  it("2 arguments one step: first argument wrong type", function () {
    var kdd = new Receptus({}),
      step = function step() {};

    expect(function () {
      kdd.step(14, step);
    }).toThrow("Wrong number or type of arguments.");
  });

  it("2 arguments one step: second argument wrong type", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step("step1", 14);
    }).toThrow("Wrong number or type of arguments.");
  });

  it("2 arguments: first or second argument wrong type", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step(false, function () {});
    }).toThrow("Wrong number or type of arguments.");
  });

  it("dependencies starting by $ are reserved", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step(function ($help) {

      });
    }).toThrow("Symbol $ in arguments only can be used with $data");
  });

  it("Only argument reserved is $data", function () {
    var kdd = new Receptus({});

    expect(function () {
      kdd.step(function ($error) {

      });
    }).toThrow("Symbol $ in arguments only can be used with $data");
  });

  it("Dependency not found", function (done) {
    var kdd = new Receptus({});

    kdd.step(function (bar) {

    }).error(function ($error) {
        expect($error.message).toBe("Dependency 'bar' doesn't exists");
        done();
      });
  });

  it("Similar dependencies load but not the needed one", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (fo) {

    }).error(function () {
        expect(kdd.resolvedDependencies).not.toEqual([]);
        done();
      });
  });

  it("Files with similar name removed because of DI", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (fo) {

    }).error(function () {
        expect(kdd.dependenciesPaths.length).toEqual(3);
        done();
      });
  });

  it("Not load a dependency with similar name", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (te) {
      return te();
    }).error(function ($error) {
        expect($error.message).toBe("Dependency 'te' doesn't exists");
        done();
      });
  });

  it("Error in multi steps in parallel", function () {
    var kdd = new Receptus({});

    kdd.saveStep("step2", function ($data) { return 10 / $data; });

    expect(function () {
      kdd.step(function () {
        return 5;
      }).step(true, ["step1", "step2"]).step(function () {

        });
    }).toThrow("There is at least one step that doesn't exists.");
  });

  it("Load anonymous function as a modul", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (anonymous) {

    }).error(function ($error) {
        expect($error.message).toBe("Dependency 'anonymous' doesn't exists");
        done();
      });
  });

  it("Load object without object.name property as a modul", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (object) {

    }).error(function ($error) {
        expect($error.message).toBe("Dependency 'object' doesn't exists");
        done();
      });
  });
});

describe("Receptus.step one step use", function () {
  it("Resolve without dependencies", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      return "foo";
    });

    kdd.promise.then(function resPromise(res) {
      expect(res).toBe("foo");
      done();
    });
  });

  it("Resolve with dependencies", function (done) {
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

  it("Resolve step with $data injected", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      return 28;
    }).step(function ($data) {
      expect($data).toBe(28);
      done();
    });
  });

  it("Step return a promise", function (done) {
    var kdd = new Receptus({});

    kdd.step(function () {
      return 14;
    }).step(function () {
      return new Receptus.Promise(function (resolve) { resolve(28); });
    }).step(function ($data) {
        expect($data).toBe(28);
        done();
      });
  });

  it("Resolved and saved dependency: folder", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (foo) {
      expect(this.resolvedDependencies.foo === foo && foo() === 15).toBeTruthy();
      done();
    });
  });

  it("Resolved and saved dependency: file", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar/foo.js");

    kdd.step(function (foo) {
      expect(this.resolvedDependencies.foo === foo && foo() === 15).toBeTruthy();
      done();
    });
  });

  it("Resolved and saved dependency: recursive search", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (Test) {
      var test = new Test();
      expect(this.resolvedDependencies["Test"] === Test && test.doIt() === 16).toBeTruthy();
      done();
    });
  });

  it("Auto create object with zero arguments constructor functions", function (done) {
    var kdd = new Receptus({});

    kdd.loadDependencies(__dirname + "/bar");

    kdd.step(function (test) {
      return test.doIt();
    }).step(function (test, $data) {
      expect(test.doIt() + $data).toBe(32);
      done();
    });
  });
});

describe("Receptus.step multi step", function () {
  it("In sequence", function (done) {
    var kdd = new Receptus({});

    kdd.addDependency("dep", function () {
      return 2;
    });

    kdd.saveStep("step1", function () { return 7; });
    kdd.saveStep("step2", function ($data) { return 10 - $data; });
    kdd.saveStep("step3", function (dep, $data) { return (10 * dep()) - $data; });

    kdd.step(false, ["step1", "step2", "step3"]).step(function ($data) {
      expect($data).toBe(17);
      done();
    });
  });

  it("In parallel", function (done) {
    var kdd = new Receptus({});

    kdd.addDependency("dep", function () {
      return 2;
    });

    kdd.saveStep("step1", function ($data) { return 7 + $data; });
    kdd.saveStep("step2", function ($data) { return 10 / $data; });
    kdd.saveStep("step3", function (dep, $data) { return $data * dep(); });

    kdd.step(function () {
      return 5;
    }).step(true, ["step1", "step2", "step3"])
      .step(function ($data) {
        var res = $data.reduce(function(previousValue, currentValue){
          return previousValue - currentValue;
        });
        expect(res).toBe(0);
        done();
      });
  });

  it("Multi steps in parallel: Throw in one step", function (done) {
    var kdd = new Receptus({});

    kdd.saveStep("step1", function ($data) { return 10 / $data; });
    kdd.saveStep("step2", function () { throw new Error("error!"); });

    kdd.step(function () {
      return 5;
    }).step(true, ["step1", "step2"]).error(function ($error) {
        expect($error.message).toBe("error!");
        done();
      });
  });

  it("Multi steps in parallel: object recursive population", function (done) {
    var kdd = new Receptus({});

    kdd.saveStep("step1", function ($data) {
      $data.b.step1 = "bar";
      return $data;
    });
    kdd.saveStep("step2", function ($data) {

      $data.b.step2 = "foo";
      return $data;
    });

    kdd.step(function () {
      var a = {};

      a["base"] = "bcn";
      a["b"] = {
        "obj": 14
      };
      return a;
    })
      .step(true, ["step1", "step2"])
      .step(function ($data) {
        expect($data).toEqual([
          {
            "base": "bcn",
            "b": {
              obj: 14,
              step1: "bar"
            }
          },
          {
            "base": "bcn",
            "b": {
              obj: 14,
              step2: "foo"
            }
          }
        ]);
        done();
      });
  });

  it("Multi steps in parallel: array recursive population", function (done) {
    var kdd = new Receptus({});

    kdd.saveStep("step1", function ($data) {
      $data[0].class = "bar";
      return $data;
    });
    kdd.saveStep("step2", function ($data) {

      $data[0].class = "foo";
      return $data;
    });

    kdd.step(function () {
      var a = [
        { a: 1},
        { a: 3},
        { a: 2}
      ];
      return a;
    })
      .step(true, ["step1", "step2"])
      .step(function ($data) {
        expect($data).toEqual([
          [
            { a: 1, "class": "bar"},
            { a: 3},
            { a: 2}
          ],
          [
            { a: 1, "class": "foo"},
            { a: 3},
            { a: 2}
          ]
        ]);
        done();
      });
  });
});