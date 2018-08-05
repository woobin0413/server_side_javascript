var mysql = require('mysql');
var conn  = mysql.createConnection({
  host     : //localhost or server,
  port     : //port,
  user     : //server username,
  password : //server password,
  database : //database
});

conn.connect(function(err) {
  if(err) throw err;
});

module.exports = conn;
/*
module.exports = function() {
  var mysql  = require('mysql');
  var conn = mysql.createConnection(methods);
  conn.connect();
  return conn
}
*/
