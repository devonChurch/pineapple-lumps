const smartDate = require('../src/js/smart-date');

describe('Smart Date Calculator', () => {

	describe('Robustness', () => {
		it('should return finished', () => expect(smartDate('2016-01-01T11:59:59+12:00', '2016-01-01T12:00:00+12:00').calcVerbalize()).toEqual('Finished'));
		it('should return today', () => expect(smartDate('2016-01-01T23:59:59+12:00', '2016-01-01T00:00:00+12:00').calcVerbalize()).toEqual('Today'));
		it('should return tomorrow', () => expect(smartDate('2016-01-02T00:00:00+12:00', '2016-01-01T23:59:59+12:00').calcVerbalize()).toEqual('Tomorrow'));
		// Saturday --> Monday = Next week.
		// it('should return xxxxxxxx', () => expect(smartDate('2016-01-06T12:00:00+12:00', '2016-01-02T12:00:00+12:00').calcVerbalize()).toEqual('Next week'));
	});

	describe('Differentiate valid / invalid dates', () => {
		it('should return an empty string if invalid', () => expect(smartDate('aBadDateSyntax', true).relevance()).toBeFalsy());
		it('should return an populated string if valid', () => expect(smartDate('2016-05-29T12:00:00+12:00', true).relevance()).toBeTruthy());
	});

	describe('Differentiate between AM and PM', () => {
		it('should return an AM value', () => expect(smartDate('2016-05-29T12:00:00+12:00', true).calcHours()).toEqual('12am'));
		it('should return a PM value', () => expect(smartDate('2016-05-29T13:00:00+12:00', true).calcHours()).toEqual('1pm'));
	});

	describe('Calculate the correct Day i.e. Mon', () => {
		it('should return an accurate Day name', () => expect(smartDate('2016-05-01T12:00:00+12:00', true).calcDay()).toEqual('Sun'));
	});

	describe('Calculate the correct Date i.e. 29th', () => {
		it('should decipher ST values', () => expect(smartDate('2016-05-01T12:00:00+12:00', true).calcDate()).toEqual('1st'));
		it('should decipher ND values', () => expect(smartDate('2016-05-02T12:00:00+12:00', true).calcDate()).toEqual('2nd'));
		it('should decipher TH values', () => expect(smartDate('2016-05-14T12:00:00+12:00', true).calcDate()).toEqual('14th'));
		it('should decipher RD values', () => expect(smartDate('2016-05-23T12:00:00+12:00', true).calcDate()).toEqual('23rd'));
	});

	describe('Calculate the correct Month i.e. Jan', () => {
		it('should return an accurate Month name', () => expect(smartDate('2016-01-29T12:00:00+12:00', true).calcMonth()).toEqual('Jan'));
	});

	describe('Calculate the correct Year i.e. 2016', () => {
		it('should return an accurate Year', () => expect(smartDate('2016-05-29T12:00:00+12:00', true).calcYear()).toEqual(2016));
	});

    describe('Identify the correct month terminology i.e. Next month', () => {
        //
        it('should return Finished', () => expect(smartDate('2016-02-01T00:00:00+12:00', '2016-01-29T23:59:59+12:00').calcVerbalize()).toEqual('Next month'));
        it('should return Finished', () => expect(smartDate('2016-03-01T00:00:00+12:00', '2016-01-31T23:59:59+12:00').calcVerbalize()).toEqual('In two months'));
        it('should return Finished', () => expect(smartDate('2016-04-01T00:00:00+12:00', '2016-01-31T23:59:59+12:00').calcVerbalize()).toEqual('In three months'));
        it('should return Finished', () => expect(smartDate('2016-05-01T00:00:00+12:00', '2016-01-31T23:59:59+12:00').calcVerbalize()).toEqual('In four months'));
        it('should return Finished', () => expect(smartDate('2016-06-01T00:00:00+12:00', '2016-01-31T23:59:59+12:00').calcVerbalize()).toEqual('In five months'));
        it('should return Finished', () => expect(smartDate('2016-07-01T00:00:00+12:00', '2016-01-31T23:59:59+12:00').calcVerbalize()).toEqual('In six months'));
        it('should return Finished', () => expect(smartDate('2016-08-01T00:00:00+12:00', '2016-01-31T23:59:59+12:00').calcVerbalize()).toEqual('In seven months'));
        it('should return Finished', () => expect(smartDate('2016-09-01T00:00:00+12:00', '2016-01-31T23:59:59+12:00').calcVerbalize()).toEqual('In eight months'));
        it('should return Finished', () => expect(smartDate('2016-10-01T00:00:00+12:00', '2016-01-31T23:59:59+12:00').calcVerbalize()).toEqual('In nine months'));
        it('should return Finished', () => expect(smartDate('2016-11-01T00:00:00+12:00', '2016-01-31T23:59:59+12:00').calcVerbalize()).toEqual('In ten months'));
        it('should return Finished', () => expect(smartDate('2016-12-01T00:00:00+12:00', '2016-01-31T23:59:59+12:00').calcVerbalize()).toEqual('In eleven months'));
    });

	describe('Identify the correct separation terminology i.e. Today', () => {
		it('should return Finished', () => expect(smartDate('2015-05-29T12:00:00+12:00', '2016-05-29T12:00:00+12:00').calcVerbalize()).toEqual('Finished'));
		it('should return Today', () => expect(smartDate('2016-05-29T12:00:00+12:00', '2016-05-29T10:00:00+12:00').calcVerbalize()).toEqual('Today'));
		it('should return Tomorrow', () => expect(smartDate('2016-05-29T12:00:00+12:00', '2016-05-28T12:00:00+12:00').calcVerbalize()).toEqual('Tomorrow'));
		it('should return In three days', () => expect(smartDate('2016-05-29T12:00:00+12:00', '2016-05-26T12:00:00+12:00').calcVerbalize()).toEqual('In three days'));
		it('should return Next week', () => expect(smartDate('2016-05-10T12:00:00+12:00', '2016-05-03T12:00:00+12:00').calcVerbalize()).toEqual('Next week'));
		it('should return In two weeks', () => expect(smartDate('2016-05-16T12:00:00+12:00', '2016-05-03T12:00:00+12:00').calcVerbalize()).toEqual('In two weeks'));
		it('should return Next month', () => expect(smartDate('2016-05-29T12:00:00+12:00', '2016-04-29T12:00:00+12:00').calcVerbalize()).toEqual('Next month'));
		it('should return In four months', () => expect(smartDate('2016-05-29T12:00:00+12:00', '2016-01-29T12:00:00+12:00').calcVerbalize()).toEqual('In four months'));
		it('should return Next year', () => expect(smartDate('2016-05-29T12:00:00+12:00', '2015-05-01T12:00:00+12:00').calcVerbalize()).toEqual('Next year'));
		it('should return In five years', () => expect(smartDate('2016-05-29T12:00:00+12:00', '2011-05-01T12:00:00+12:00').calcVerbalize()).toEqual('In five years'));
	});

	// Tests for today, tomorrow, etc using the test date
		// ^^ include "Finished" and then the generic date
	// Full test with all date options
	// Account for leap year!
});

// Today Sun 19 May
// Tomorrow Sun 19 May
// In 3 days Sun 19 May
// Next Week Sun 19 May
// In 3 Week Time Sun 19 May
// Next month Sun 19 May
// In 2 months Sun 19 May
// Next Year Sun 19 May
// in 2 Years Sun 19 May
