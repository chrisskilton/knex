import Engine_MySQL from '../mysql/engine'
import Promise      from '../../promise'
import assign       from 'lodash/object/assign'

export default class Engine_MariaSQL extends Engine_MySQL {

  get driver() {
    return 'mariasql'
  }

  get dialect() {
    return 'mariasql'
  }

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.
  acquireRawConnection() {
    var connection = new this.Driver()
    connection.connect(assign({metadata: true}, this.connectionSettings))
    return new Promise((resolver, rejecter) => {
      connection
        .on('connect', function() {
          connection.removeAllListeners('end')
          connection.removeAllListeners('error')
          resolver(connection)
        })
        .on('error', rejecter)
    })
  }

  // Return the database for the MariaSQL client.
  database() {
    return this.connectionSettings.db;
  }

}
