const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

console.log("Database Pool: Initializing MySQL connection pool...");

// Resolve the cert file path to work in both local development and on Render
const certPath = path.resolve(__dirname, "../certs/tidb-ca.pem");
let caCert;
try {
  caCert = fs.readFileSync(certPath);
  console.log("SSL CA certificate loaded successfully");
} catch (err) {
  const fallbackPath = path.resolve(process.cwd(), "certs/tidb-ca.pem");
  caCert = fs.readFileSync(fallbackPath);
  console.log("SSL CA certificate loaded successfully");
}

const poolConfig = dbUrl
  ? {
      uri: dbUrl,
      ssl: {
        ca: caCert
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
        ca: caCert
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
