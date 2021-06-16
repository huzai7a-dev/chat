import mysql from 'mysql';
import env from '../env.json';

const connection = mysql.createConnection({
  host     : "192.168.0.7",
  user     : 'crmreact',
  password : '123',
  database: "bwchrms",
});
 
connection.connect((err)=> {
  if (err) return console.error('error connecting: ' + err.stack);
  console.log('connected as id ' + connection.threadId);
});

export default connection;