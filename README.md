# Receptus [![Build Status](https://travis-ci.org/RocAlayo/receptus.svg)](https://travis-ci.org/RocAlayo/receptus)

Node module that apply DI concept and Promises to shape a KDD process. We recommend the use in conjunction with [Receptus Algorithms](http://github.com/RocAlayo/receptus-algorithms) 

## Quick Use

To install this module:

	npm install receptus
	
And then to use it:

	var Receptus = require("receptus"),
		receptus = new Receptus({
			path: "" //Absolute path to algorithms
		});


## Quick description of functions available


	//Absolute path to algorithms
	receptus = new Receptus();
	receptus = new Receptus({
		path: [String]
	});
	receptus = new Receptus({
		path: [Array of String]
	});


    // Load absolute paths to files with algorithms, uses deep search
	receptus.loadDependencies([String]);
	receptus.loadDependencies([Array of String]);
	
	
	// Save a dependency so when needed the system will be able to resolve it
	// First arguments is the id of the dependency
	// Second argument is the value of the dependency
	receptus.addDependency([String], [Mixed]) 
	
	
	// Save a step to use it multiple times
	// First arguments is the id of the step
	// Second argument is a callback with DI capabilities
	receptus.saveStep([String], [Function]);
	
	// Encapsulation of Promise.then second argument function
	// Callback function has DI capabilities 
	receptus.error([Function]);
	
	
	// Encapsulation of Promise. then first argument function
	// Callback function has DI capabilities
	// String is the id of a saved step
	// Boolean: True -> Parallel steps
	// Boolean: False -> Sequential steps
	receptus.step([Function]);
	receptus.step([String], [Function]);
	receptus.step([String]);
	receptus.step([Boolean], [Array of String]);
	

For examples go [Receptus Algorithms Examples](http://github.com/RocAlayo/receptus-algorithms/tree/master/examples)


