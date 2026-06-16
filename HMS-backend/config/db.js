const mysql = require("mysql2");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

const pool = dbUrl
  ? mysql.createPool(dbUrl)
  : mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sync_care",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

module.exports = pool;
