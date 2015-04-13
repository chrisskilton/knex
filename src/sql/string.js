var hasBuffer = typeof Buffer !== 'undefined'

export function escapeId(val, forbidQualified) {
  if (Array.isArray(val)) {
    return val.map(function(v) {
      return escapeId(v, forbidQualified);
    }).join(', ');
  }

  if (forbidQualified) {
    return '`' + val.replace(/`/g, '``') + '`';
  }
  return '`' + val.replace(/`/g, '``').replace(/\./g, '`.`') + '`';
}

export function escapeParam(val, stringifyObjects, timeZone) {
  if (val === undefined || val === null) {
    return 'NULL';
  }

  switch (typeof val) {
    case 'boolean': return (val) ? 'true' : 'false';
    case 'number': return val+'';
  }

  if (val instanceof Date) {
    val = dateToString(val, timeZone || 'local');
  }

  if (hasBuffer && Buffer.isBuffer(val)) {
    return bufferToString(val);
  }

  if (Array.isArray(val)) {
    return arrayToList(val, timeZone);
  }

  if (typeof val === 'object') {
    val = val.toString();
  }

  val = val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function(s) {
    switch(s) {
      case "\0": return "\\0";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\b": return "\\b";
      case "\t": return "\\t";
      case "\x1a": return "\\Z";
      default: return "\\"+s;
    }
  });
  return "'"+val+"'";
}

export function arrayToList(array, timeZone) {
  return array.map(function(v) {
    if (Array.isArray(v)) return '(' + arrayToList(v, timeZone) + ')';
    return escapeParam(v, true, timeZone);
  }).join(', ');
}

export function format(sql, values, stringifyObjects, timeZone) {
  values = values == null ? [] : [].concat(values);

  var index = 0;
  return sql.replace(/\?\??/g, function(match) {
    if (index === values.length) {
      return match;
    }

    var value = values[index++];

    return match === '??'
      ? escapeId(value)
      : escapeParam(value, stringifyObjects, timeZone);
  });
};

export function dateToString(date, timeZone) {
  var dt = new Date(date);

  if (timeZone != 'local') {
    var tz = convertTimezone(timeZone);

    dt.setTime(dt.getTime() + (dt.getTimezoneOffset() * 60000));
    if (tz !== false) {
      dt.setTime(dt.getTime() + (tz * 60000));
    }
  }

  var year   = dt.getFullYear();
  var month  = zeroPad(dt.getMonth() + 1, 2);
  var day    = zeroPad(dt.getDate(), 2);
  var hour   = zeroPad(dt.getHours(), 2);
  var minute = zeroPad(dt.getMinutes(), 2);
  var second = zeroPad(dt.getSeconds(), 2);
  var millisecond = zeroPad(dt.getMilliseconds(), 3);

  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millisecond;
};

export function bufferToString(buffer) {
  return "X'" + buffer.toString('hex') + "'";
};

function zeroPad(number, length) {
  number = number.toString();
  while (number.length < length) {
    number = '0' + number;
  }
  return number;
}

function convertTimezone(tz) {
  if (tz == "Z") return 0;
  var m = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
  if (m) {
    return (m[1] == '-' ? -1 : 1) * (parseInt(m[2], 10) + ((m[3] ? parseInt(m[3], 10) : 0) / 60)) * 60;
  }
  return false;
}