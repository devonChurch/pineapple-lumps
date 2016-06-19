# Pineapple Lumps

A smart date tool for comparing the duration between the current time and a given date reference expressed in a verbalised format.

## Todo's

***This project is still a work in progress.***
- Add in an event duration comparison.
- Have the ability to extract, change and compare different time zones on the fly.

## Installation

- Install the package as a dependancy.
```
npm install pineapple-lumps --save
```

- Require the package into your project
``` javascript
const pineappleLumps = require('pineapple-lumps');
```

- Pass in a date reference to get the comparison.
``` javascript
const comparison = pineappleLumps('2016-01-01T09:45:00+12:00'); // In three days, 1st Jan 2016
```

## License

MIT
