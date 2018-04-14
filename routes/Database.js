module.exports.connect = async function(query, params) {
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
    const [results, fields] = await connection.execute(query);
    return [results, fields];
  }
  else if (params != null) {
    const [results, fields] = await connection.execute(query, params);
    return [results, fields];
  }
}

