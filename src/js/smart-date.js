const debug = require('debug');
const _general = debug('SD:general');
const _year = debug('SD:year');
const _month = debug('SD:month');
const _week = debug('SD:week');
const _day = debug('SD:day');

/**
 * The wrapper function for the smart date functionality.
 * @param {string} supplied - The date format in which to base the relativity
 * around.
 * @param {string} test - An optional param that takes any truthly value to act
 * as a flag for surfacing the Smart Date API. This makes testing in Jasime much
 * easier / more concise as you can target system on a granular level. If you pass
 * in a string then we arrempt to create a date object out of it to act as the
 * current time in which to reference against. This again makes testing much easier
 * as you control the comparison data.
 * @example
 * // Standard live implementation.
 * var myDate = smartDate('2016-05-29T12:00:00+12:00');
 * @example
 * // Surface the Smart Date API.
 * var myDate = smartDate('2016-05-29T12:00:00+12:00’, true);
 * @example
 * // Surface the Smart Date API and override the current time reference.
 * var myDate = smartDate('2016-05-29T12:00:00+12:00’, '2016-07-01T12:00:00+12:00’);
 * @returns {string} The formatted Smart Date OR if utilising the test param we
 * get back an {object} of all relevant Smart Date internal systems.
 */
function smartDate(supplied, test) {


	const

	/**
	 * Generate a new launch data object from the supplied date param. If the
	 * supplied format is not applicable then we sign false and return an
	 * corresponding value (empty string).
	 */
	launch = supplied ? new Date(supplied) : false,

	/**
	 * Generate a new date for the current browser time. We also query the test
	 * parameter here to see if we should instead use a predefined date format
	 * for testing purposes.
	 */
	now = test && typeof test === 'string' ? new Date(test) : new Date(),

	/**
	 * Days are currently using the USA format where the week starts with Sunday.
	 * We are rebasing this to use Monday as the first day with Sunday becoming
	 * the last.
	 * @return {number} The numerical reference to the day i.e. Monday = 1, Sunday = 7.
	 */
	rebaseDay = (date) => {

		const usa = date.getDay();

		return usa === 0 ? 7 : usa;

	},

	/**
	 * Augments a number for their string equivalent. We should not need any more
	 * than 12 references unless there is an event 12 years in the future i.e:
	 * - Max 7 days in a week.
	 * - Max 4 weeks in a month.
	 * - Max 12 months in a year.
	 * @return {string} The string equivalent.
	 */
	numberName = (option) => {

		const options = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

		return options[option - 1];

	},

	/**
	 * Formats the separations value into a spoken sequence based on singular and
	 * plural instances.
	 * @param {number} value - The amount of units to reference.
	 * @param {string} type - The unit type.
	 * @example
	 * // returns “In five months”
	 * const myDate = speechPattern(5, ‘month’);
	 * @example
	 * // returns “In next month”
	 * const myDate = speechPattern(1, ‘month’);
	 * @returns {string} The formatted seperation.
	 */
	speechPattern = (value, type) => value > 1 ? `In ${numberName(value)} ${type}s` : `Next ${type}`,

	/**
	 * Takes a millisecond value into days
	 * @param {number} milliseconds - The millisecond value to convert.
	 * @return {number} The converted day value.
	 */
	convertToDays = (milliseconds) => Math.floor(milliseconds / (24 * 60 * 60 * 1000)),

	/**
	 * Calculates if the current year is a leap year or not.
	 * "A year, occurring once every four years, which has 366 days including 29
	 * February as an intercalary day".
	 * Last leap year 2016.
	 * @param {number} year - The year value in which to compare.
	 * @return {boolean} A reference to the leap years relevance.
	 */
	leapYear = (year) => year % 4 === 0,

	/**
	 * Find the total days in a given month.
	 * @param {object} data - The date object to extract the current month from.
	 * @return {number} The total days.
	 */
	daysInMonth = (date) => {

        const _daysInMonth = debug('SD:daysInMonth');

		let current = 31;
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const generateDate = () => new Date(`${year}/${month}/${current}`).getDate();

		_daysInMonth(`initial generation = ${generateDate()}`);

		while (generateDate() !== current) {

			_daysInMonth(`bad = ${year}/${month}/${current} !== ${current}`);
			current -= 1;

		}

		_daysInMonth(`good = ${current}`);

		return current;

	},

	/**
	 * Creates a data object that holds that maximum number of the possible days
	 * from a supplied year and month value.
	 * @param {number} year - Year reference.
	 * @param {number} month - Number reference.
	 * @return {object} A new Date object.
	 */
	maximiumDays = (year, month) => {

		// convertToDays(new Date(`${year}/${month}/${daysInMonth(today)}`).getTime());

		const date = new Date(`${year}/${month}/1`);
		const maximum = daysInMonth(date);

		_day(`MAXIMUM DAYS: max = ${maximum}`);
		_day(`MAXIMUM DAYS: date = ${`${year}/${month}/${maximum}`}`);
		_day(`MAXIMUM DAYS: full date = ${new Date(`${year}/${month}/${maximum}`)}`);


		return new Date(`${year}/${month}/${maximum}`);

	},

	/**
	 * Holds the comparison code for the week, month and year durations. If deemed
	 * relevant we create the verbalization setup around this unit type.
	 * @type {Object}
	 */
	duration = {

		day() {

			// we should just be able to bung the day in as its the last option left to test =)

		},

		week(today, days) {

			// 1 ----- current ----- end
			// ^^^ rip off and then divide by 7

			const current = rebaseDay(today);
			_week(`DURATION | WEEK: rebased day = ${current}`);
			const comparison = 7 - current;

			_week(`DURATION | WEEK: days <= comparison = ${days} vs ${comparison}`);

			return days <= comparison ? 0 : (() => {

				_week('** RUNNING! WEEK');

				const remainder = days - comparison;
				const week = Math.floor(remainder / 7) + 1;

				_week(`DURATION: remainder = ${remainder}`);
				_week(`DURATION: week = ${week}`);

				return week;


			})(); // Math.floor(days - comparison / 7) + 1;

		},

		month(today, days) {

			// Current days in month - loop back from 31 until we get a ping?
			// GET: (same as years but multiple times...)
			// this months total days
			// remaining days

            _month(today.getTime());
            _month(convertToDays(today.getTime()));

			_month(`today = ${today}`);
			_month(`days = ${days}`);

			let year, month, date, min, max, comparison;
			let months = 0;
			// Calculate the next year and month to compare in the loop. If the
			// new values spill past their maximum possible value then we reset
			// them to their minimum reference.
			const nextMonth = () => month + 1 > 12 ? 1 : month += 1;
			const nextYear = () => month === 1 ? year += 1 : year;

			do {

				// If this is the first time through the loop then we need to
				// populate the year and month and current references.
                month = month ? nextMonth() : today.getMonth() + 1;
                year = year ? nextYear() : today.getFullYear();
                date = new Date(`${year}/${month}/${1}`);
                max = daysInMonth(date);
                min = months === 0 ? today.getDate() : 0;
                comparison = max - min;


                // min = months ? today.getTime() : new Date(`${year}/${month}/${1}`).getTime();
                // max = maximiumDays(year, month).getTime();
                // // max = daysInMonth(5);
                // comparison = convertToDays(max - min);

                // remove the max num of days in a month
                // OR
                // the dirrerence between the current day and the end of the month

                _month(`min = ${min}`);
                _month(`max = ${max}`);
                _month(`comparison = ${comparison}`);


				// year = year ? nextYear() : today.getFullYear();
				// month = month ? nextMonth() : today.getMonth() + 1;
				// max = maximiumDays(year, month).getTime();
				// comparison = months ? convertToDays(max) : convertToDays(max - today.getTime());


                // year = year ? nextYear() : today.getFullYear();
                // month = month ? nextMonth() : today.getMonth() + 1;
                // min = !months ? today.getTime() : new Date(`${year}/${month}/${1}`).getTime();
                // max = maximiumDays(year, month).getTime();
                // comparison = convertToDays(max - min);


				// Break out of the loop if its not relevance to continue.
				_month(`days < comparison = ${days} < ${comparison}`);
				// if (days < comparison) break;
				if (days < comparison) break;

                days -= comparison;
				// months += 1; // days > comparison ? 1 : 0;
				_month(`comparison >= max = ${comparison} >= ${max}`);
				months += 1; // comparison >= max ? 1 : 0;
				// months += months === 0 ? 1 : max < days ? 1 : 0; // comparison >= max ? 1 : 0;


				_month('RELEVANT');

                // _month(`current = ${current}`);

				_month(`today = ${today}`);
				// _month(`comparison = ${comparison}`);
				// _month(`relevance = ${days > comparison}`);
				// _month(`days = ${days}`);

				_month(`months = ${months}`);
				_month(' - - - - ');

			} while (days > 0);

			_month(`months = ${months}`);

			return months === 0 ? false : months;

		},

		year(today, days) {

			_year(`DURATION | YEAR: today = ${today}`);
			_year(`DURATION | YEAR: days = ${days}`);
			_year(' - - - - ');

			let year, current, comparison;
			let years = 0;
			const daysPerYear = () => leapYear(year) ? 364 : 365;

			do {

				// If this is the first time through the loop then we need to
				// populate the year and month and current references.
				year = year ? year += 1 : today.getFullYear();
				current = current ? daysPerYear() : convertToDays(new Date(`${year}/12/31`).getTime() - today.getTime());

                _year('year', year);
                _year('current', current);
                _year(`days < current = ${days} < ${current}`);

                // Break out of the loop if its not relevance to continue.
				if (days < current) break;

				days -= current;
				years += 1; // days > current ? 1 : 0;

				_year(`DURATION | YEAR: years = ${years}`);
				_year(`DURATION | YEAR: days = ${days}`);
				_year(' - - - - ');

			} while (days > 0);

			_year(`DURATION | YEAR: years = ${years}`);

			return years === 0 ? false : years;

		}

	},

	calcSeperaton = (today, days) => {

		if (days < 0) return 'Finished';
		else if (days === 0) return 'Today';
		else if (days === 1) return 'Tomorrow';

		for (const unit of ['year', 'month', 'week']) {

			const value = duration[unit](today, days);
			// console.log(`SEPERATION: ${unit} = ${value}`);
			if (value) return speechPattern(value, unit);

		}

		return speechPattern(days, 'day');

	},

	rebaseDate = (ref) => {

		// 2009/07/12
		const year = ref.getFullYear();
		const month = ref.getMonth() + 1;
		const date = ref.getDate();
		const format = `${year}/${month}/${date}`;

		return new Date(format);

	},

	calcComparison = () => {

		const today = rebaseDate(now);
		const startDay = rebaseDate(launch);
		const comparison = startDay.getTime() - today.getTime();

		// console.log(`COMPARISON: launch = ${startDay} | now = ${today}`);
		// console.log(`COMPARISON: ${today.getTime()} - ${startDay.getTime()} = ${comparison}`);

		return {today, comparison};

	},

	calcVerbalize = () => {

		const {today, comparison} = calcComparison();
		const days = convertToDays(comparison);
		const seperation = calcSeperaton(today, days);

		console.log(`VERBALISE: ${days}`);


		return seperation;

	},

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// GENERIC:
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	calcDay = () => {

		const options = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const option = launch.getDay();

		return options[option];

	},

	calcSuffix = (date) => {

		switch (date) {
			case 1: case 21: case 31:
				return 'st';
			case 2: case 22:
				return 'nd';
			case 3: case 23:
				return 'rd';
			default:
				return 'th';
		}

	},

	// Dates that are not two digits - should they have a prepended zero i.e. 01, 02
	calcDate = () => {

		const date = launch.getDate();
		const suffix = calcSuffix(date);

		return `${date}${suffix}`;

	},

	calcMonth = () => {

		const options = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const option = launch.getMonth();

		return options[option];

	},

	calcYear = () => launch.getFullYear(),

	calcHours = () => {

		const hours = launch.getHours();

		console.log(`HOURS: raw = ${hours}`);

		return hours > 12 ? `${hours - 12}pm` : `${hours}am`;

	},

	calcZone = () => {

		// Safari:
		// Tue May 31 2016 16:45:49 GMT+1200 (NZST)

		// Chrome:
		// Tue May 31 2016 16:46:40 GMT+1200 (NZST)

		// FF
		// foo.toString();
		// Tue May 31 2016 16:46:40 GMT+1200 (NZST)

		// IE
		// Mon May 30 21:52:19 PDT 2016

		// How important is the time zone?
		// We can write a hack using regex on the above (will need robust testing)
		// We can use the "dateTimeFormat" but its compatibility is limited + does
		// not return the format you are after
		// http://caniuse.com/#search=DateTimeFormat

		return 'Dunno?';

	},

	init = () => `${calcVerbalize()} ${calcDay()} ${calcDate()} ${calcMonth()} ${calcHours()} ${calcZone()}`,

	// relevance = () => launch && launch.getTime() ? true : false;
	relevance = () => launch && launch.getTime();

	// I am going to expose the private API to make it easier to test since there are still
	// things up in the air regarding the various systems i.e elapsed dates / time zones.
	// This will make the Jasmine testing more direct and remote the superfluousness.
    // switch (test) {
    //     case true:
    //         _general('test mode');
    //         return {relevance, init, calcDay, calcDate, calcMonth, calcYear, calcHours, calcVerbalize};
    //     default:
    //         _general('live mode');
    //         return relevance() ? init() : '';
    // }
	if (test) {

        _general('test mode');
		return {relevance, init, calcDay, calcDate, calcMonth, calcYear, calcHours, calcVerbalize};

	} else {

        _general('live mode');
		return relevance() ? init() : '';

	}

}

module.exports = smartDate;
