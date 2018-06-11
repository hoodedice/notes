module.exports.connect = async function (query, params) {
  // get the client
  const mysql = require('mysql2/promise');
  // create the connection
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQL_USER_ID,
    password: process.env.MYSQL_PASSWORD,
    database: 'notesDB'
  });
  // query database
  if (params == null) {
    const [u_results, fields] = await connection.execute(query);
    const results = await SetDateObjectsToUTC(u_results);
    return [results, fields];
  }
  else if (params != null) {
    const [u_results, fields] = await connection.execute(query, params);
    const results = await SetDateObjectsToUTC(u_results);
    return [results, fields];
  }
}

// NOTE: for ... of does not work for BinaryRow, which is what each element of results[0] is.

// WORKAROUND:  Because mysql2 does not get timezone information from the database (yet), this
//              function coerces datetime columns to JS Date objects in the UTC/GMT timezone
async function SetDateObjectsToUTC(results) {
  let rows = results[0];
  for (column in rows) {
    if (Object.prototype.toString.call(rows[column]) === "[object Date]") {
      rows[column] = createDateAsUTC(rows[column]);
    }
  }
  results[0] = rows;
  return results;
}

// https://stackoverflow.com/a/14006555
function createDateAsUTC(date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}
