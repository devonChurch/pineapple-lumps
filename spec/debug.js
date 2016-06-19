require('babel-register');

const debug = require('debug')('SD:debug');
// const smartDate = require('../src/js/smart-date');
const pineappleLumps = require('../dist/pineapple-lumps');
const launch = '2016-01-01T11:59:59+12:00'; // '2016-03-01T00:00:00+12:00';
const today = '2016-01-01T12:00:00+12:00'; // '2016-01-31T23:59:59+12:00';

debug(pineappleLumps);
console.log(pineappleLumps);

const result = pineappleLumps(launch, today).init();

// MUST CHANGE DATE STRUCTURE!!!!!!!

// I typically have to manage the date format 2011-09-24T00:00:00 so this is what I do.
// var date = "2011-09-24T00:00:00";
// new Date( date.replace(/-/g, '\/').replace(/T.+/, ''));
// // => Sat Sep 24 2011 00:00:00 GMT-0700 (MST) - CORRECT DATE.

debug('looking for: 4 months');
debug(result);
