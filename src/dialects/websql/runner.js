import SQLite3_Runner from '../sqlite3/runner'
import Promise        from '../../promise'
import pluck          from 'lodash/collection/pluck'
import clone          from 'lodash/lang/clone'

// export default class WebSQL_Runner extends SQLite3_Runner {

//   // Runs the query on the specified connection, 
//   // providing the bindings and any other necessary prep work.
//   _query = function(obj) {
//     return new Promise((resolver, rejecter) => {
//       if (this.isDebugging()) this.debug(obj);
//       if (!this.connection) {
//         return rejecter(new Error('No connection provided.'));
//       }
//       this.connection.executeSql(obj.sql, obj.bindings, function(trx, response) {
//         obj.response = response;
//         return resolver(obj);
//       }, function(trx, err) {
//         rejecter(err);
//       });
//     });
//   }

//   // Null out the transaction statements so they aren't run.
//   _beginTransaction    = null;
//   _commitTransaction   = null;
//   _rollbackTransaction = null;

//   // Ensures the response is returned in the same format as other clients.
//   processResponse(obj) {
//     var resp = obj.response;
//     if (obj.output) return obj.output.call(this, resp);
//     switch (obj.method) {
//       case 'pluck':
//       case 'first':
//       case 'select':
//         var results = [];
//         for (var i = 0, l = resp.rows.length; i < l; i++) {
//           results[i] = clone(resp.rows.item(i));
//         }
//         if (obj.method === 'pluck') results = pluck(results, obj.pluck);
//         return obj.method === 'first' ? results[0] : results;
//       case 'insert':
//         return [resp.insertId];
//       case 'delete':
//       case 'update':
//       case 'counter':
//         return resp.rowsAffected;
//       default:
//         return resp;
//     }
//   }

// }