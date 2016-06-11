require('babel-register');

const smartDate = require('../src/js/smart-date');

console.log('JASMINE: spec.js');
console.log(smartDate());


describe('Smart dates', function() {
  it('should work', function() {
    expect(true).toBe(true);
  });
});
