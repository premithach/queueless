const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Premi@2004",
  database: "queueless",
});

connection.connect((error) => {
  if (error) {
    console.error("MySQL connection failed:", error.message);
    return;
  }

  console.log("Connected to QueueLess MySQL database");
});

module.exports = connection;