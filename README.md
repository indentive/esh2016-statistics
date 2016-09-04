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

### Live Data Api

The following endpoints will first stream all old data and then stream live data. Note that previous data is ordered by the `nodeId` of a z-wave sensor, meaning that all data from node `10` comes before all data from node `11`. Since node ids are strings they are in lexicographic order and not numeric. Therefore node `6` will come after `11`. Within one node, all data is ordered by timestamps.

* `http://esh2016.indentive.se/w` time series of current energy consumption, unit `W`
* `http://esh2016.indentive.se/kwh` time series of accumulated energy consumption, unit `kWh`

If the DNS A pointer has not yet been resolved, you can use the ip adress `82.196.1.98`

Example:

```bash
$ curl http://82.196.1.98/w
{"value":70.032,"scale":"W","teamName":"TEAM 20 *","nodeId":"10","ts":1472890602950}
{"value":71.224,"scale":"W","teamName":"TEAM 20 *","nodeId":"10","ts":1472890819540}
{"value":68.858,"scale":"W","teamName":"TEAM 20 *","nodeId":"10","ts":1472891035501}
{"value":71.441,"scale":"W","teamName":"TEAM 20 *","nodeId":"10","ts":1472891251580}
{"value":70.367,"scale":"W","teamName":"TEAM 20 *","nodeId":"10","ts":1472891467940}
..
```

**NOTE** Don't count on this api being up and running after `ESH2016` is finished.

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
