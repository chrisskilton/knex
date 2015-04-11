import Engine_MariaSQL     from './maria/engine'
import Engine_Oracle       from './maria/engine'
import Engine_MySQL        from './mysql/engine'
import Engine_MySQL2       from './mysql2/engine'
import Engine_SQLite3      from './sqlite3/engine'
import Engine_WebSQL       from './websql/engine'
import Engine_PostgreSQL   from './postgresql/engine'
import Engine_StrongOracle from './strong-oracle/engine'

export default {
  mysql:      Engine_MySQL,
  mysql2:     Engine_MySQL2,
  maria:      Engine_MariaSQL,
  sqlite3:    Engine_SQLite3,
  websql:     Engine_WebSQL,
  postgresql: Engine_PostgreSQL,
  oracle:     Engine_Oracle,
  ['strong-oracle']: Engine_MariaSQL
}