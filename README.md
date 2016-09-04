# esh2016-statistics

Aggregates data from [`ESH2016`](http://eastswedenhack.se/) and outputs to:

* `data/kwh.json` time series of total energy consumption for all teams
* `data/w.json` time series of momentary energy for all teams
* `data/summary.json` summary of total energy for all teams, lowlist, max and mean of momentary values

### Install

```bash
$ npm i esh2016-statistics -S
```

### JS Api

Static data via JS api:

```js
const data = require('esh2016-statistics')
console.log('kwh', data.kwh)
console.log('w', data.w)
console.log('summary', data.summary)
```

### License
MIT
