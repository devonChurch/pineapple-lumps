/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var smartDate = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var debug = __webpack_require__(2);
	var _general = debug('SD:general');
	var _year = debug('SD:year');
	var _month = debug('SD:month');
	var _week = debug('SD:week');
	var _day = debug('SD:day');
	
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
	
		var
	
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
		rebaseDay = function rebaseDay(date) {
	
			var usa = date.getDay();
	
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
		numberName = function numberName(option) {
	
			var options = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
	
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
		speechPattern = function speechPattern(value, type) {
			return value > 1 ? 'In ' + numberName(value) + ' ' + type + 's' : 'Next ' + type;
		},
	
	
		/**
	  * Takes a millisecond value into days
	  * @param {number} milliseconds - The millisecond value to convert.
	  * @return {number} The converted day value.
	  */
		convertToDays = function convertToDays(milliseconds) {
			return Math.floor(milliseconds / (24 * 60 * 60 * 1000));
		},
	
	
		/**
	  * Calculates if the current year is a leap year or not.
	  * "A year, occurring once every four years, which has 366 days including 29
	  * February as an intercalary day".
	  * Last leap year 2016.
	  * @param {number} year - The year value in which to compare.
	  * @return {boolean} A reference to the leap years relevance.
	  */
		leapYear = function leapYear(year) {
			return year % 4 === 0;
		},
	
	
		/**
	  * Find the total days in a given month.
	  * @param {object} data - The date object to extract the current month from.
	  * @return {number} The total days.
	  */
		daysInMonth = function daysInMonth(date) {
	
			var _daysInMonth = debug('SD:daysInMonth');
	
			var current = 31;
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var generateDate = function generateDate() {
				return new Date(year + '/' + month + '/' + current).getDate();
			};
	
			_daysInMonth('initial generation = ' + generateDate());
	
			while (generateDate() !== current) {
	
				_daysInMonth('bad = ' + year + '/' + month + '/' + current + ' !== ' + current);
				current -= 1;
			}
	
			_daysInMonth('good = ' + current);
	
			return current;
		},
	
	
		/**
	  * Creates a data object that holds that maximum number of the possible days
	  * from a supplied year and month value.
	  * @param {number} year - Year reference.
	  * @param {number} month - Number reference.
	  * @return {object} A new Date object.
	  */
		maximiumDays = function maximiumDays(year, month) {
	
			// convertToDays(new Date(`${year}/${month}/${daysInMonth(today)}`).getTime());
	
			var date = new Date(year + '/' + month + '/1');
			var maximum = daysInMonth(date);
	
			_day('MAXIMUM DAYS: max = ' + maximum);
			_day('MAXIMUM DAYS: date = ' + (year + '/' + month + '/' + maximum));
			_day('MAXIMUM DAYS: full date = ' + new Date(year + '/' + month + '/' + maximum));
	
			return new Date(year + '/' + month + '/' + maximum);
		},
	
	
		/**
	  * Holds the comparison code for the week, month and year durations. If deemed
	  * relevant we create the verbalization setup around this unit type.
	  * @type {Object}
	  */
		duration = {
			day: function day() {
	
				// we should just be able to bung the day in as its the last option left to test =)
	
			},
			week: function week(today, days) {
	
				// 1 ----- current ----- end
				// ^^^ rip off and then divide by 7
	
				var current = rebaseDay(today);
				_week('DURATION | WEEK: rebased day = ' + current);
				var comparison = 7 - current;
	
				_week('DURATION | WEEK: days <= comparison = ' + days + ' vs ' + comparison);
	
				return days <= comparison ? 0 : function () {
	
					_week('** RUNNING! WEEK');
	
					var remainder = days - comparison;
					var week = Math.floor(remainder / 7) + 1;
	
					_week('DURATION: remainder = ' + remainder);
					_week('DURATION: week = ' + week);
	
					return week;
				}(); // Math.floor(days - comparison / 7) + 1;
			},
			month: function month(today, days) {
	
				// Current days in month - loop back from 31 until we get a ping?
				// GET: (same as years but multiple times...)
				// this months total days
				// remaining days
	
				_month(today.getTime());
				_month(convertToDays(today.getTime()));
	
				_month('today = ' + today);
				_month('days = ' + days);
	
				var year = void 0,
				    month = void 0,
				    date = void 0,
				    min = void 0,
				    max = void 0,
				    comparison = void 0;
				var months = 0;
				// Calculate the next year and month to compare in the loop. If the
				// new values spill past their maximum possible value then we reset
				// them to their minimum reference.
				var nextMonth = function nextMonth() {
					return month + 1 > 12 ? 1 : month += 1;
				};
				var nextYear = function nextYear() {
					return month === 1 ? year += 1 : year;
				};
	
				do {
	
					// If this is the first time through the loop then we need to
					// populate the year and month and current references.
					month = month ? nextMonth() : today.getMonth() + 1;
					year = year ? nextYear() : today.getFullYear();
					date = new Date(year + '/' + month + '/' + 1);
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
	
					_month('min = ' + min);
					_month('max = ' + max);
					_month('comparison = ' + comparison);
	
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
					_month('days < comparison = ' + days + ' < ' + comparison);
					// if (days < comparison) break;
					if (days < comparison) break;
	
					days -= comparison;
					// months += 1; // days > comparison ? 1 : 0;
					_month('comparison >= max = ' + comparison + ' >= ' + max);
					months += 1; // comparison >= max ? 1 : 0;
					// months += months === 0 ? 1 : max < days ? 1 : 0; // comparison >= max ? 1 : 0;
	
					_month('RELEVANT');
	
					// _month(`current = ${current}`);
	
					_month('today = ' + today);
					// _month(`comparison = ${comparison}`);
					// _month(`relevance = ${days > comparison}`);
					// _month(`days = ${days}`);
	
					_month('months = ' + months);
					_month(' - - - - ');
				} while (days > 0);
	
				_month('months = ' + months);
	
				return months === 0 ? false : months;
			},
			year: function year(today, days) {
	
				_year('DURATION | YEAR: today = ' + today);
				_year('DURATION | YEAR: days = ' + days);
				_year(' - - - - ');
	
				var year = void 0,
				    current = void 0,
				    comparison = void 0;
				var years = 0;
				var daysPerYear = function daysPerYear() {
					return leapYear(year) ? 364 : 365;
				};
	
				do {
	
					// If this is the first time through the loop then we need to
					// populate the year and month and current references.
					year = year ? year += 1 : today.getFullYear();
					current = current ? daysPerYear() : convertToDays(new Date(year + '/12/31').getTime() - today.getTime());
	
					_year('year', year);
					_year('current', current);
					_year('days < current = ' + days + ' < ' + current);
	
					// Break out of the loop if its not relevance to continue.
					if (days < current) break;
	
					days -= current;
					years += 1; // days > current ? 1 : 0;
	
					_year('DURATION | YEAR: years = ' + years);
					_year('DURATION | YEAR: days = ' + days);
					_year(' - - - - ');
				} while (days > 0);
	
				_year('DURATION | YEAR: years = ' + years);
	
				return years === 0 ? false : years;
			}
		},
		    calcSeperaton = function calcSeperaton(today, days) {
	
			if (days < 0) return 'Finished';else if (days === 0) return 'Today';else if (days === 1) return 'Tomorrow';
	
			var _arr = ['year', 'month', 'week'];
			for (var _i = 0; _i < _arr.length; _i++) {
				var unit = _arr[_i];
	
				var value = duration[unit](today, days);
				// console.log(`SEPERATION: ${unit} = ${value}`);
				if (value) return speechPattern(value, unit);
			}
	
			return speechPattern(days, 'day');
		},
		    rebaseDate = function rebaseDate(ref) {
	
			// 2009/07/12
			var year = ref.getFullYear();
			var month = ref.getMonth() + 1;
			var date = ref.getDate();
			var format = year + '/' + month + '/' + date;
	
			return new Date(format);
		},
		    calcComparison = function calcComparison() {
	
			var today = rebaseDate(now);
			var startDay = rebaseDate(launch);
			var comparison = startDay.getTime() - today.getTime();
	
			// console.log(`COMPARISON: launch = ${startDay} | now = ${today}`);
			// console.log(`COMPARISON: ${today.getTime()} - ${startDay.getTime()} = ${comparison}`);
	
			return { today: today, comparison: comparison };
		},
		    calcVerbalize = function calcVerbalize() {
			var _calcComparison = calcComparison();
	
			var today = _calcComparison.today;
			var comparison = _calcComparison.comparison;
	
			var days = convertToDays(comparison);
			var seperation = calcSeperaton(today, days);
	
			console.log('VERBALISE: ' + days);
	
			return seperation;
		},
	
	
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// GENERIC:
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
		calcDay = function calcDay() {
	
			var options = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			var option = launch.getDay();
	
			return options[option];
		},
		    calcSuffix = function calcSuffix(date) {
	
			switch (date) {
				case 1:case 21:case 31:
					return 'st';
				case 2:case 22:
					return 'nd';
				case 3:case 23:
					return 'rd';
				default:
					return 'th';
			}
		},
	
	
		// Dates that are not two digits - should they have a prepended zero i.e. 01, 02
		calcDate = function calcDate() {
	
			var date = launch.getDate();
			var suffix = calcSuffix(date);
	
			return '' + date + suffix;
		},
		    calcMonth = function calcMonth() {
	
			var options = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var option = launch.getMonth();
	
			return options[option];
		},
		    calcYear = function calcYear() {
			return launch.getFullYear();
		},
		    calcHours = function calcHours() {
	
			var hours = launch.getHours();
	
			console.log('HOURS: raw = ' + hours);
	
			return hours > 12 ? hours - 12 + 'pm' : hours + 'am';
		},
		    calcZone = function calcZone() {
	
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
		    init = function init() {
			return calcVerbalize() + ' ' + calcDay() + ' ' + calcDate() + ' ' + calcMonth() + ' ' + calcHours() + ' ' + calcZone();
		},
	
	
		// relevance = () => launch && launch.getTime() ? true : false;
		relevance = function relevance() {
			return launch && launch.getTime();
		};
	
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
			return { relevance: relevance, init: init, calcDay: calcDay, calcDate: calcDate, calcMonth: calcMonth, calcYear: calcYear, calcHours: calcHours, calcVerbalize: calcVerbalize };
		} else {
	
			_general('live mode');
			return relevance() ? init() : '';
		}
	}
	
	module.exports = smartDate;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(3);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();
	
	/**
	 * Colors.
	 */
	
	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];
	
	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	
	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}
	
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */
	
	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};
	
	
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;
	
	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);
	
	  if (!useColors) return args;
	
	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));
	
	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });
	
	  args.splice(lastC, 0, c);
	  return args;
	}
	
	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */
	
	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}
	
	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */
	
	exports.enable(load());
	
	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */
	
	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(4);
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previously assigned color.
	 */
	
	var prevColor = 0;
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function debug(namespace) {
	
	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;
	
	  // define the `enabled` version
	  function enabled() {
	
	    var self = enabled;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();
	
	    var args = Array.prototype.slice.call(arguments);
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;
	
	  var fn = exports.enabled(namespace) ? enabled : disabled;
	
	  fn.namespace = namespace;
	
	  return fn;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */
	
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;
	
	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */
	
	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};
	
	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */
	
	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}
	
	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}
	
	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}
	
	/**
	 * Pluralization helper.
	 */
	
	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map