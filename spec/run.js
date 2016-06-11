require('babel-register');
const debug = require('debug')('Jasmine:run');
const Jasmine = require('jasmine');
const jasmine = new Jasmine();

console.log('JASMINE: run.js');

jasmine.loadConfigFile('./jasmine.json');
debug('Executing');
jasmine.execute();


// import Jasmine from 'jasmine'
//
// var jasmine = new Jasmine();
//
// jasmine.loadConfigFile('./jasmine.json');
// jasmine.execute();
