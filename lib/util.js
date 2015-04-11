'use strict';

exports.__esModule = true;
exports.isEngine = isEngine;
exports.warn = warn;

function isEngine(val) {
  return val && val['@@__KNEX_ENGINE__@@'] === true;
}

function warn(msg) {
  console.log('Knex Warning: ' + msg);
}