'use strict'

const level = require('level')
const sub = require('subleveldown')
const clone = require('clone')
const fs = require('fs')
const debug = require('debug')('statistics')
const teams = require('./teams.json')
const db = level('db', { createIfMissing: false })

db.once('open', () => {
  debug('DB is open')

  const kWh = sub(db, 'kWhTS', { valueEncoding: 'json' })
  const W = sub(db, 'WTS', { valueEncoding: 'json' })

  gatherData(kWh, (err, kwhData) => {
    if (err) throw err
    fs.writeFileSync('data/kwh.json', JSON.stringify(kwhData, null, 2))
    gatherData(W, (err, wData) => {
      if (err) throw err
      fs.writeFileSync('data/w.json', JSON.stringify(wData, null, 2))
      const summary = {
        totals: totalsSummary(kwhData),
        momentary: momentarySummary(wData)
      }
      fs.writeFileSync('data/summary.json', JSON.stringify(summary, null, 2))
    })
  })
})

function totalsSummary (nodes) {
  console.log(JSON.stringify(nodes, null, 2))
  const total = nodes.map((node) => {
    return node.y[node.y.length - 1]
  }).reduce((curr, prev) => {
    return curr + prev
  }, 0)

  const teams = nodes.map((node) => {
    let lastValue = node.y[node.y.length - 1]
    let perc = lastValue / total
    perc *= 10000
    perc = Math.round(perc) / 100
    return {
      name: node.name,
      value: lastValue + ' kWh',
      perc: perc + ' %'
    }
  }).sort((a, b) => {
    return (a.value < b.value ? -1 : 1)
  })

  return {
    all: total + ' kWh',
    teams: teams
  }
}

function momentarySummary (nodes) {
  return {
    max: MAP(nodes, MAX),
    mean: MAP(nodes, MEAN)
  }
}

function MAP (nodes, fn) {
  return nodes.map((node) => {
    return {
      name: node.name,
      value: fn(node.y)
    }
  }).sort((a, b) => {
    return (a.value < b.value ? -1 : 1)
  }).map((node) => {
    const copy = clone(node)
    copy.value += ' W'
    return copy
  })
}

function MAX (array) {
  return array.reduce((curr, prev) => {
    return (curr > prev ? curr : prev)
  }, 0)
}

function MEAN (array) {
  const sum = array.reduce((curr, prev) => {
    return curr + prev
  }, 0)
  return sum / array.length
}

function gatherData (sub, cb) {
  const result = {}

  sub.createReadStream()
    .on('data', onData)
    .on('error', cb.bind(null))
    .on('end', () => {
      cb(null, objToSortedArray(result))
    })

  function onData (data) {
    const key = data.key
    const value = Number(data.value.value)
    const nodeId = key.split(':')[0]
    const ts = Number(key.split(':')[1])

    if (String(ts).indexOf('.') > 0) return

    if (result[nodeId] === undefined) {
      const teamName = teams[nodeId]
      result[nodeId] = {
        x: [],
        y: [],
        name: teamName
      }
    }

    const node = result[nodeId]
    const length = node.x.length
    if (length > 0) {
      // ignore datapoint too close to previous
      const last = node.x[length - 1]
      if (ts - last > 1000) {
        node.x.push(ts)
        node.y.push(value)
      }
    } else {
      node.x.push(ts)
      node.y.push(value)
    }
  }
}

function objToSortedArray (data) {
  return Object.keys(data).map((key) => {
    return data[key]
  }).sort((a, b) => {
    var aId = Number(a.name.split(' ')[1])
    var bId = Number(b.name.split(' ')[1])
    return (aId < bId ? -1 : 1)
  })
}
