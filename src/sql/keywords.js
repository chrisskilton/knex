
class Keyword {
  constructor(value) {
    this['@@knex/value'] = value
    this['@@knex/hook']  = 'keyword'
  }
}

export var _ALL_     = new Keyword('*')
export var UNION_ALL = new Keyword('UNION ALL')
export var UNION     = new Keyword('UNION')
export var ALL       = new Keyword('ALL')
export var JOIN      = new Keyword('JOIN')
export var NULL      = new Keyword('NULL')
export var INNER     = new Keyword('INNER')
export var OUTER     = new Keyword('OUTER')
export var DELETE    = new Keyword('DELETE FROM')
export var SELECT    = new Keyword('SELECT')
export var FROM      = new Keyword('FROM')
export var WHERE     = new Keyword('WHERE')
export var GROUP_BY  = new Keyword('GROUP BY')
export var ORDER_BY  = new Keyword('ORDER BY')
export var HAVING    = new Keyword('HAVING')
export var LIMIT     = new Keyword('LIMIT')
export var SET       = new Keyword('SET')
export var VALUES    = new Keyword('VALUES')
export var OR        = new Keyword('OR')
export var AND       = new Keyword('AND')
export var IF        = new Keyword('IF')
export var IS        = new Keyword('IS')
export var AS        = new Keyword('AS')
export var DISTINCT  = new Keyword('DISTINCT')
export var NOT       = new Keyword('NOT')
export var EXISTS    = new Keyword('EXISTS')
export var IN        = new Keyword('IN')
export var BETWEEN   = new Keyword('BETWEEN')
export var ASC       = new Keyword('ASC')
export var DESC      = new Keyword('DESC')
export var OFFSET    = new Keyword('OFFSET')