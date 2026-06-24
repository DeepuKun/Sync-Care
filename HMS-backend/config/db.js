const mysql = require("mysql2");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

console.log("Database Pool: Initializing MySQL connection pool...");
console.log("Database Pool: SSL/TLS transport config: ssl.rejectUnauthorized = false");

const poolConfig = dbUrl
  ? {
      uri: dbUrl,
      ssl: {
        rejectUnauthorized: false
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }
  : {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sync_care",
      ssl: {
        rejectUnauthorized: false
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

if (dbUrl) {
  console.log("Database Pool: Connecting using connection URL.");
} else {
  console.log(`Database Pool: Connecting to host: ${process.env.DB_HOST || "127.0.0.1"}:${process.env.DB_PORT || 3306}, database: ${process.env.DB_NAME || "sync_care"}`);
}

const pool = mysql.createPool(poolConfig);

// Hook connection events for validation logging
pool.on('connection', (connection) => {
  console.log("Database Pool: A new secure connection was established.");
});

module.exports = pool;
