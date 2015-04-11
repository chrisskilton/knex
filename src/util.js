
export function isEngine(val) {
  return val && val['@@__KNEX_ENGINE__@@'] === true
}

export function warn(msg) {
  console.log(`Knex Warning: ${msg}`)
}