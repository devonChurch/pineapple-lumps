require('babel-register');

const debug = require('debug')('SD:debug');
const smartDate = require('../src/js/smart-date');
const launch = '2016-05-31T12:00:00+12:00';
const today = '2016-01-01T12:00:00+12:00';
const result = smartDate(launch, today).init();

debug('looking for: 4 months');
debug(result);
