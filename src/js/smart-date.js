const debug = require('debug');
// const debug = require('debug')('test');
// const debug = require('debug')('http')

console.log('smart date');

module.exports = () => {

    const _year = debug('year');
    const _month = debug('month');
    const _day = debug('day');

    _year('logging test');
    _month('logging test');
    _day('logging test');


    const message = 'hello world';

    return message;

};
