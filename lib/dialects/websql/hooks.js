'use strict';

var websqlHooks = {

  // Ensures the response is returned in the same format as other clients.
  onRow: function onRow(obj) {
    var resp = obj.response;
    if (obj.output) {
      return obj.output.call(this, resp);
    }switch (obj.method) {
      case 'pluck':
      case 'first':
      case 'select':
        var results = [];
        for (var i = 0, l = resp.rows.length; i < l; i++) {
          results[i] = _.clone(resp.rows.item(i));
        }
        if (obj.method === 'pluck') results = _.pluck(results, obj.pluck);
        return obj.method === 'first' ? results[0] : results;
      case 'insert':
        return [resp.insertId];
      case 'delete':
      case 'update':
      case 'counter':
        return resp.rowsAffected;
      default:
        return resp;
    }
  }

};