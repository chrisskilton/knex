
// Oracle Engine
// -------
import {ReturningHelper} from './utils'
import clone             from  'lodash/lang/clone'
import Engine            from '../../engine'
import Promise           from  '../../promise'
import Pool              from '../../pool'

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
export default class Engine_Oracle extends Engine {

  static wrapIdentifier(value) {
    return (value !== '*' ? '"' + value.replace(/"/g, '""') + '"' : '*');
  }

  get driver() {
    return 'oracle'
  }

  constructor(config) {
    super(config)
    if (config.debug) this.isDebugging = true
    this.connectionSettings = _.clone(config.connection)
    // this.pool   = new Pool(assign({
    //   release(client, callback) { 
    //     client.close()
    //     callback()
    //   }
    // }, config.pool))
  }

  get dialect() {
    return 'oracle'
  }

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.
  acquireRawConnection() {
    return new Promise((resolver, rejecter) => {
      return this.driver.connect(this.connectionSettings, (err, connection) => {
        if (err) return rejecter(err)
        if (self.connectionSettings.prefetchRowCount) {
          connection.setPrefetchRowCount(self.connectionSettings.prefetchRowCount)
        }
        resolver(connection)
      })
    })
  }

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  destroyRawConnection(connection) {
    connection.close()
  }

  // Return the database for the Oracle client.
  database() {
    return this.connectionSettings.database
  }

  // Position the bindings for the query.
  positionBindings(sql) {
    var questionCount = 0
    return sql.replace(/\?/g, function() {
      questionCount += 1
      return ':' + questionCount
    })
  }

  preprocessBindings(bindings) {
    if (!bindings) return;
    return bindings.map(function(binding) {
      if (binding instanceof ReturningHelper && driver) {
        // returning helper uses always ROWID as string
        return new this.driver.OutParam(driver.OCCISTRING)
      }
      if (typeof binding === 'boolean') {
        return binding ? 1 : 0
      }
      return binding
    })
  }

}