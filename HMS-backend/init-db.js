const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function initDb() {
  const host = process.env.DB_HOST || "127.0.0.1";
  const port = parseInt(process.env.DB_PORT || "3306");
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  let databaseName = process.env.DB_NAME || "sync_care";

  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  console.log("Database Init: Starting connection attempt...");

  // Resolve the cert file path to work in both local development and on Render
  const certPath = path.resolve(__dirname, "certs/tidb-ca.pem");
  let caCert;
  try {
    caCert = fs.readFileSync(certPath);
    console.log("SSL CA certificate loaded successfully");
  } catch (err) {
    const fallbackPath = path.resolve(process.cwd(), "certs/tidb-ca.pem");
    caCert = fs.readFileSync(fallbackPath);
    console.log("SSL CA certificate loaded successfully");
  }

  if (dbUrl) {
    console.log(`Database Init: Connecting to MySQL database using connection URL...`);
    try {
      const parsedUrl = new URL(dbUrl);
      databaseName = parsedUrl.pathname.substring(1).split("?")[0] || databaseName;
    } catch (e) {
      console.warn("Database Init: Failed to parse database name from connection URL, using default.");
    }
  } else {
    console.log(`Database Init: Connecting to MySQL server at ${host}:${port} as ${user}...`);
  }

  let connection;
  try {
    // 1. Establish secure connection
    if (dbUrl) {
      connection = await mysql.createConnection({
        uri: dbUrl,
        multipleStatements: true,
        ssl: {
          ca: caCert
        }
      });
    } else {
      connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
        multipleStatements: true,
        ssl: {
          ca: caCert
        }
      });
    }

    console.log("Database Init: Connected successfully. SSL/TLS secure transport established.");
    
    // 2. Create database if allowed, then select it
    try {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
      console.log(`Database Init: Database creation/verification success: ${databaseName}`);
    } catch (dbCreateErr) {
      console.warn(`Database Init: CREATE DATABASE statement failed (this is expected if your database user has restricted privileges on cloud platforms like TiDB): ${dbCreateErr.message}`);
    }
    
    try {
      await connection.query(`USE \`${databaseName}\`;`);
      console.log(`Database Init: Selected and using database: ${databaseName}`);
    } catch (useDbErr) {
      console.error(`Database Init: Failed to select database ${databaseName}:`, useDbErr);
      throw useDbErr;
    }

    // 2. Define Table DDL statements
    const tableDDLs = [
      `CREATE TABLE IF NOT EXISTS users (
          user_id VARCHAR(100) PRIMARY KEY,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS doctors (
          doc_id VARCHAR(100) PRIMARY KEY,
          doc_name VARCHAR(150) NOT NULL,
          specialization VARCHAR(150) NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS patient_list (
          patient_id VARCHAR(100) PRIMARY KEY,
          patient_name VARCHAR(150) NOT NULL,
          address TEXT NOT NULL,
          doc_assigned VARCHAR(100) NOT NULL,
          specialization VARCHAR(150) NOT NULL,
          status VARCHAR(50) DEFAULT 'Waiting',
          test_status VARCHAR(50) DEFAULT NULL,
          lab_tech_assigned VARCHAR(100) DEFAULT NULL,
          result_date DATE DEFAULT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS medicine (
          med_id VARCHAR(100) PRIMARY KEY,
          med_name VARCHAR(150) NOT NULL,
          available INT NOT NULL DEFAULT 0,
          price DECIMAL(10,2) NOT NULL,
          expiry_date DATE DEFAULT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS med_dept (
          med_dept_id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(150) NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS prescription (
          pres_id INT AUTO_INCREMENT PRIMARY KEY,
          patient_id VARCHAR(100) NOT NULL,
          medicine_name VARCHAR(150) NOT NULL,
          morning VARCHAR(50) DEFAULT '0',
          noon VARCHAR(50) DEFAULT '0',
          evening VARCHAR(50) DEFAULT '0',
          night VARCHAR(50) DEFAULT '0'
      );`,
      `CREATE TABLE IF NOT EXISTS lab (
          lab_id INT AUTO_INCREMENT PRIMARY KEY,
          patient_id VARCHAR(100) NOT NULL,
          test_type VARCHAR(150) NOT NULL,
          sub_type VARCHAR(150) NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS lab_test (
          lab_tech_id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          department VARCHAR(150) NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS front_desk (
          front_desk_id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(150) NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS results (
          result_id INT AUTO_INCREMENT PRIMARY KEY,
          patient_id VARCHAR(100) NOT NULL,
          file_name VARCHAR(255) NOT NULL,
          result_file LONGBLOB NOT NULL,
          date DATE NOT NULL
      );`
    ];

    console.log("Database Init: Creating/verifying tables...");
    for (const ddl of tableDDLs) {
      await connection.query(ddl);
    }
    console.log("Database Init: Tables created/verified successfully.");

    // 3. Drop and recreate stored procedures
    const procedures = [
      {
        name: "AddDoctor",
        drop: "DROP PROCEDURE IF EXISTS AddDoctor;",
        create: `CREATE PROCEDURE AddDoctor(
            IN p_doc_id VARCHAR(100),
            IN p_doc_name VARCHAR(150),
            IN p_specialization VARCHAR(150),
            IN p_password VARCHAR(255)
        )
        BEGIN
            INSERT INTO doctors (doc_id, doc_name, specialization) 
            VALUES (p_doc_id, p_doc_name, p_specialization)
            ON DUPLICATE KEY UPDATE doc_name = p_doc_name, specialization = p_specialization;

            INSERT INTO users (user_id, password, role) 
            VALUES (p_doc_id, p_password, 'doctor_view')
            ON DUPLICATE KEY UPDATE password = p_password, role = 'doctor_view';
        END;`
      },
      {
        name: "AddLabTech",
        drop: "DROP PROCEDURE IF EXISTS AddLabTech;",
        create: `CREATE PROCEDURE AddLabTech(
            IN p_lab_tech_id VARCHAR(100),
            IN p_name VARCHAR(150),
            IN p_department VARCHAR(150),
            IN p_password VARCHAR(255),
            IN p_role VARCHAR(50)
        )
        BEGIN
            INSERT INTO lab_test (lab_tech_id, name, department) 
            VALUES (p_lab_tech_id, p_name, p_department)
            ON DUPLICATE KEY UPDATE name = p_name, department = p_department;

            INSERT INTO users (user_id, password, role) 
            VALUES (p_lab_tech_id, p_password, p_role)
            ON DUPLICATE KEY UPDATE password = p_password, role = p_role;
        END;`
      },
      {
        name: "AddFrontDesk",
        drop: "DROP PROCEDURE IF EXISTS AddFrontDesk;",
        create: `CREATE PROCEDURE AddFrontDesk(
            IN p_front_desk_id VARCHAR(100),
            IN p_name VARCHAR(150),
            IN p_password VARCHAR(255),
            IN p_role VARCHAR(50)
        )
        BEGIN
            INSERT INTO front_desk (front_desk_id, name) 
            VALUES (p_front_desk_id, p_name)
            ON DUPLICATE KEY UPDATE name = p_name;

            INSERT INTO users (user_id, password, role) 
            VALUES (p_front_desk_id, p_password, p_role)
            ON DUPLICATE KEY UPDATE password = p_password, role = p_role;
        END;`
      },
      {
        name: "AddMedDept",
        drop: "DROP PROCEDURE IF EXISTS AddMedDept;",
        create: `CREATE PROCEDURE AddMedDept(
            IN p_med_dept_id VARCHAR(100),
            IN p_name VARCHAR(150),
            IN p_password VARCHAR(255),
            IN p_role VARCHAR(50)
        )
        BEGIN
            INSERT INTO med_dept (med_dept_id, name) 
            VALUES (p_med_dept_id, p_name)
            ON DUPLICATE KEY UPDATE name = p_name;

            INSERT INTO users (user_id, password, role) 
            VALUES (p_med_dept_id, p_password, p_role)
            ON DUPLICATE KEY UPDATE password = p_password, role = p_role;
        END;`
      },
      {
        name: "DeleteDoctor",
        drop: "DROP PROCEDURE IF EXISTS DeleteDoctor;",
        create: `CREATE PROCEDURE DeleteDoctor(IN p_id VARCHAR(100))
        BEGIN
            DELETE FROM doctors WHERE doc_id = p_id;
            DELETE FROM users WHERE user_id = p_id;
        END;`
      },
      {
        name: "DeleteLabTech",
        drop: "DROP PROCEDURE IF EXISTS DeleteLabTech;",
        create: `CREATE PROCEDURE DeleteLabTech(IN p_id VARCHAR(100))
        BEGIN
            DELETE FROM lab_test WHERE lab_tech_id = p_id;
            DELETE FROM users WHERE user_id = p_id;
        END;`
      },
      {
        name: "DeleteFrontDesk",
        drop: "DROP PROCEDURE IF EXISTS DeleteFrontDesk;",
        create: `CREATE PROCEDURE DeleteFrontDesk(IN p_id VARCHAR(100))
        BEGIN
            DELETE FROM front_desk WHERE front_desk_id = p_id;
            DELETE FROM users WHERE user_id = p_id;
        END;`
      },
      {
        name: "DeleteMedDept",
        drop: "DROP PROCEDURE IF EXISTS DeleteMedDept;",
        create: `CREATE PROCEDURE DeleteMedDept(IN p_id VARCHAR(100))
        BEGIN
            DELETE FROM med_dept WHERE med_dept_id = p_id;
            DELETE FROM users WHERE user_id = p_id;
        END;`
      }
    ];

    console.log("Database Init: Setting up stored procedures...");
    for (const proc of procedures) {
      await connection.query(proc.drop);
      await connection.query(proc.create);
      console.log(`Database Init: Created/updated stored procedure: ${proc.name}`);
    }

    // 4. Seed Default Admin
    console.log("Database Init: Checking for default admin account...");
    const [adminRows] = await connection.query("SELECT * FROM users WHERE user_id = ? AND role = ?", ["admin", "admin"]);
    if (adminRows.length === 0) {
      console.log("Database Init: Seeding default admin account...");
      const adminPass = "admin123";
      const hashedPass = await bcrypt.hash(adminPass, 10);
      await connection.query("INSERT INTO users (user_id, password, role) VALUES (?, ?, ?)", ["admin", hashedPass, "admin"]);
      console.log(`Database Init: Default admin created successfully! ID: admin, Password: ${adminPass}`);
    } else {
      console.log("Database Init: Default admin account already exists.");
    }

    console.log("Database Init: Database initialization completed successfully!");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDb();
