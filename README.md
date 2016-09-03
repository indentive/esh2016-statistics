# esh2016-statistics

Aggregates data from [`ESH2016`](http://eastswedenhack.se/) and outputs to:

* `data/kwh.json` time series of total energy consumption for all teams
* `data/w.json` time series of momentary energy for all teams
* `data/summary.json` summary of total energy for all teams, lowlist, max and mean of momentary values

### Install

**NOTE** Current version on npm is not the final data. Final data will be released as `1.0.0` and never change after that.

```bash
$ npm i esh2016-statistics -S
```

### Api

Also exports the data into JavaScript.

```js
const data = require('esh2016-statistics')
console.log('kwh', data.kwh)
console.log('w', data.w)
console.log('summary', data.summary)
```

### License
MIT
