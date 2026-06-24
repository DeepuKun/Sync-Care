const express = require("express"); 
const cors = require("cors"); 
const dotenv = require("dotenv"); 
const db = require("./config/db"); 
const multer = require("multer"); 
const fs = require("fs"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 5000; 
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_sync_care_2026_jwt_token";

// File upload setup
const tempDir = "temp/";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}
const upload = multer({ dest: tempDir }); 

// Middlewares 
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.use(express.json());

console.log("PORT ENV =", process.env.PORT);

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  // Allow checking token in query params for direct anchor link downloads
  let token = req.query.token;
  
  if (!token) {
    const authHeader = req.headers["authorization"];
    token = authHeader && authHeader.split(" ")[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Access Denied: Invalid Token" });
    }
    req.user = user;
    next();
  });
};

// Role authorization middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Unauthorized role" });
    }
    next();
  };
};

// Test route 
app.get("/", (req, res) => { 
  res.status(200).json({
    status: "healthy",
    message: "Sync-Care Backend is running",
    timestamp: new Date()
  }); 
}); 

// AUTHENTICATION LOGIN =================================================================
app.post("/login", (req, res) => { 
  const { id, password, role } = req.body; 

  if (!id || !password || !role) { 
    return res.status(400).json({ message: "All fields are required" }); 
  } 

  const query = "SELECT * FROM users WHERE user_id = ? AND role = ?"; 
  db.query(query, [id, role], async (err, result) => { 
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid ID or Role" });
    }
    
    const user = result[0];
    
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      // Plaintext fallback for legacy/manually seeded data
      if (!isMatch && password !== user.password) {
        return res.status(401).json({ message: "Wrong password" });
      }

      const token = jwt.sign(
        { id: user.user_id, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({ 
        success: true, 
        message: "Login successful", 
        token: token,
        user_id: user.user_id, 
        role: user.role 
      }); 
    } catch (bcryptErr) {
      console.error(bcryptErr);
      return res.status(500).json({ message: "Authentication error" });
    }
  }); 
});

// PUBLIC REGISTRATION ENDPOINTS =========================================================
app.get("/public/doctors", (req, res) => {
  const query = "SELECT doc_id, doc_name, specialization FROM doctors";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching public doctors:", err);
      return res.status(500).json({ error: "Failed to fetch doctors" });
    }
    res.json(results);
  });
});

app.post("/register-patient", async (req, res) => {
  const { patient_id, password } = req.body;

  if (!patient_id || !password) {
    return res.status(400).json({ error: "Aadhar Card Number and Password are required" });
  }

  // Check if patient_id already exists in users
  const checkSql = "SELECT * FROM users WHERE user_id = ?";
  db.query(checkSql, [patient_id], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error during check" });
    }
    if (result.length > 0) {
      return res.status(400).json({ error: "Aadhar Card Number already registered" });
    }

    try {
      // Find the first doctor in DB to assign as default for DB integrity
      db.query("SELECT doc_id, specialization FROM doctors LIMIT 1", async (docErr, docResult) => {
        let docId = "default_doc";
        let spec = "General Medicine";
        
        if (!docErr && docResult && docResult.length > 0) {
          docId = docResult[0].doc_id;
          spec = docResult[0].specialization;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const insertPatientSql = `
          INSERT INTO patient_list (patient_id, patient_name, address, doc_assigned, specialization, status)
          VALUES (?, 'New Patient', 'Not Provided', ?, ?, 'Waiting')
        `;

        db.query(insertPatientSql, [patient_id, docId, spec], (insertErr) => {
          if (insertErr) {
            console.error(insertErr);
            return res.status(500).json({ error: "Patient registration failed in database" });
          }

          const insertUserSql = "INSERT INTO users (user_id, password, role) VALUES (?, ?, 'user')";
          db.query(insertUserSql, [patient_id, hashedPassword], (userErr) => {
            if (userErr) {
              console.error(userErr);
              return res.status(500).json({ error: "User login creation failed" });
            }

            res.status(201).json({ message: "Registration successful! You can now log in." });
          });
        });
      });
    } catch (hashErr) {
      console.error(hashErr);
      res.status(500).json({ error: "Server error during registration setup" });
    }
  });
});

// PATIENTS OPERATIONS =================================================================
app.post("/add-patient", authenticateToken, authorizeRoles("front_desk_view", "admin"), (req, res) => { 
  const { patient_id, patient_name, address, doc_assigned, specialization } = req.body; 

  if (!patient_id || !patient_name || !address || !doc_assigned || !specialization) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = ` 
    INSERT INTO patient_list  
    (patient_id, patient_name, address, doc_assigned, specialization) 
    VALUES (?, ?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE 
      patient_name = VALUES(patient_name), 
      address = VALUES(address), 
      doc_assigned = VALUES(doc_assigned), 
      specialization = VALUES(specialization), 
      status = 'Waiting'
  `; 
  
  db.query(
    sql, 
    [patient_id, patient_name, address, doc_assigned, specialization], 
    async (err, result) => { 
      if (err) { 
        console.error(err); 
        return res.status(500).json({ error: "Database insert failed" }); 
      } 

      // Create a user login account for the patient using default password "password123"
      const defaultPassword = "password123";
      try {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const userSql = "INSERT INTO users (user_id, password, role) VALUES (?, ?, 'user') ON DUPLICATE KEY UPDATE role = 'user'";
        db.query(userSql, [patient_id, hashedPassword], (userErr) => {
          if (userErr) {
            console.error("Failed to insert user login account for patient:", userErr);
          }
          res.status(201).json({ 
            message: "Patient added successfully",
            patientId: patient_id, 
          }); 
        });
      } catch (hashErr) {
        console.error(hashErr);
        res.status(500).json({ error: "Password setup failed for patient" });
      }
    } 
  ); 
}); 

app.get("/patients/:doc_id", authenticateToken, authorizeRoles("doctor_view", "admin"), (req, res) => { 
  const { doc_id } = req.params; 
  const sql = "SELECT * FROM patient_list where doc_assigned = ? and (status = ? OR status = ?)";
  
  db.query(sql, [doc_id, "Waiting", "Ready"], (err, results) => { 
    if (err) { 
      console.error(err); 
      return res.status(500).json({ error: "Failed to fetch patients" }); 
    } 
    res.json(results); 
  }); 
}); 

app.get("/doctor-info/:doc_id", authenticateToken, (req, res) => { 
  const sql = "SELECT * FROM doctors where doc_id = ?"; 
  const { doc_id } = req.params; 
  
  db.query(sql, [doc_id], (err, results) => { 
    if (err) { 
      console.error(err); 
      return res.status(500).json({ error: "Failed to fetch doctor info" }); 
    } 
    res.json(results); 
  }); 
}); 

app.put("/patients/:id/status", authenticateToken, authorizeRoles("doctor_view", "admin"), (req, res) => { 
  const { id } = req.params; 
  const { status } = req.body; 

  const sql = "UPDATE patient_list SET status = ? WHERE patient_id = ?"; 

  db.query(sql, [status, id], (err, result) => { 
    if (err) return res.status(500).json(err); 
    res.json({ message: "Status updated successfully" }); 
  }); 
}); 

app.get('/every-patients', authenticateToken, authorizeRoles("front_desk_view", "admin"), (req, res) => { 
  const query = 'SELECT * FROM patient_list'; 
  
  db.query(query, (err, results) => { 
    if (err) { 
      console.error('Error fetching patients:', err); 
      return res.status(500).json({ error: 'Database error' }); 
    } 
    res.json(results); 
  }); 
}); 

app.get('/ready-patients', authenticateToken, authorizeRoles("front_desk_view", "admin", "doctor_view"), (req, res) => { 
  const query = 'SELECT * FROM patient_list where status = ?'; 
  
  db.query(query, ['Ready'], (err, results) => { 
    if (err) { 
      console.error('Error fetching patients:', err); 
      return res.status(500).json({ error: 'Database error' }); 
    } 
    res.json(results); 
  }); 
}); 

app.get("/patient/:id", authenticateToken, authorizeRoles("user", "front_desk_view", "doctor_view", "admin"), (req, res) => { 
  const id = req.params.id; 
  if (req.user.role === "user" && req.user.id !== id) {
    return res.status(403).json({ message: "Access Denied: Unauthorized patient access" });
  }
  const sql = ` 
    SELECT  
      p.patient_name, 
      p.address, 
      p.doc_assigned, 
      p.specialization, 
      p.status, 
      p.test_status, 
      p.lab_tech_assigned, 
      p.result_date, 
      u.password 
    FROM patient_list p 
    JOIN users u ON p.patient_id = u.user_id 
    WHERE p.patient_id = ? 
  `; 

  db.query(sql, [id], (err, result) => { 
    if (err) return res.status(500).json(err); 
    if (result.length === 0) { 
      return res.json({}); 
    } 
    res.json(result[0]); 
  }); 
}); 

// MEDICINE OPERATIONS ================================================================= 
app.post("/medicine", authenticateToken, authorizeRoles("medicine_view", "admin"), (req, res) => { 
  const { med_id, med_name, available, price } = req.body; 

  if (!med_id || !med_name || available == null || !price) { 
    return res.status(400).json({ message: "All fields required" }); 
  } 

  const checkQuery = "SELECT * FROM medicine WHERE med_id = ?"; 
  db.query(checkQuery, [med_id], (err, result) => { 
    if (err) return res.status(500).json({ message: "DB error" }); 

    if (result.length > 0) { 
      return res.status(400).json({ message: "Medicine ID already exists" }); 
    } 

    const insertQuery = ` 
      INSERT INTO medicine (med_id, med_name, available, price, expiry_date) 
      VALUES (?, ?, ?, ?, CURDATE() + INTERVAL 2 YEAR) 
    `; 

    db.query(insertQuery, [med_id, med_name, available, price], (err) => { 
      if (err) return res.status(500).json({ message: "Insert failed" }); 
      res.status(201).json({ message: "Medicine added successfully" }); 
    }); 
  }); 
}); 

app.get("/medicine", authenticateToken, (req, res) => { 
  const query = "SELECT * FROM medicine"; 
  db.query(query, (err, result) => { 
    if (err) { 
      console.error(err); 
      return res.status(500).json({ message: "Database error" }); 
    } 
    res.status(200).json(result); 
  }); 
}); 

app.get("/medicine/:id", authenticateToken, (req, res) => { 
  const { id } = req.params; 
  const sql = "SELECT * FROM medicine WHERE med_id = ?"; 
  
  db.query(sql, [id], (err, result) => { 
    if (err) return res.status(500).json(err); 
    if (result.length === 0) { 
      return res.status(404).json({ message: "Medicine not found" }); 
    } 
    res.json(result[0]); 
  }); 
}); 

app.get('/lowest-medicines', authenticateToken, authorizeRoles("medicine_view", "admin"), (req, res) => { 
  const query = 'Select * from medicine where available <= 5'; 
  db.query(query, (err, results) => { 
    if (err) return res.status(500).json(err); 
    res.json(results); 
  }); 
}); 

// PRESCRIPTIONS OPERATIONS ============================================================= 
app.post("/prescription", authenticateToken, authorizeRoles("doctor_view", "admin"), (req, res) => { 
  const { 
    patient_id, 
    medicine_name, 
    morning, 
    noon, 
    evening, 
    night 
  } = req.body; 

  const sql = ` 
    INSERT INTO prescription  
    (patient_id, medicine_name, morning, noon, evening, night) 
    VALUES (?, ?, ?, ?, ?, ?) 
  `; 

  db.query( 
    sql, 
    [patient_id, medicine_name, morning, noon, evening, night], 
    (err, result) => { 
      if (err) { 
        console.error(err); 
        return res.status(500).json({ error: "Failed to add prescription" }); 
      } 
      res.status(201).json({ 
        message: "Prescription added successfully", 
        pres_id: result.insertId 
      }); 
    } 
  ); 
}); 

app.get("/prescription/:id", authenticateToken, authorizeRoles("user", "doctor_view", "admin"), (req, res) => { 
  const { id } = req.params; 
  if (req.user.role === "user" && req.user.id !== id) {
    return res.status(403).json({ message: "Access Denied" });
  }
  const sql = "Select * from prescription where patient_id = ?"; 
  
  db.query(sql, [id], (err, result) => { 
    if (err) return res.status(500).json(err); 
    res.json(result); 
  }); 
}); 

app.get('/user/:id', authenticateToken, authorizeRoles("user", "doctor_view", "admin"), (req, res) => { 
  const { id } = req.params; 
  if (req.user.role === "user" && req.user.id !== id) {
    return res.status(403).json({ message: "Access Denied" });
  }
  const sql = "Select * from prescription where patient_id = ?"; 

  db.query(sql, [id], (err, result) => { 
    if (err) return res.status(500).json(err); 
    res.json(result); 
  }); 
}); 

app.delete('/delete-prescription/:p_id', authenticateToken, authorizeRoles("doctor_view", "admin"), (req, res) => { 
  const query = 'DELETE FROM prescription WHERE patient_id = ?'; 
  const { p_id } = req.params; 
  
  db.query(query, [p_id], (err, results) => { 
    if (err) return res.status(500).json(err); 
    res.json(results); 
  }); 
}); 

// DOCTORS INFO & VIEW ================================================================== 
app.get('/every-doctors', authenticateToken, authorizeRoles("front_desk_view", "admin"), (req, res) => { 
  const query = 'SELECT * FROM doctors'; 
  db.query(query, (err, results) => { 
    if (err) { 
      console.error('Error fetching doctors:', err); 
      return res.status(500).json({ error: 'Database error' }); 
    } 
    res.json(results); 
  }); 
}); 

app.get('/doctors/:specialization', authenticateToken, authorizeRoles("front_desk_view", "admin"), (req, res) => { 
  const query = 'SELECT * FROM doctors where specialization = ?'; 
  const { specialization } = req.params; 
  
  db.query(query, [specialization], (err, results) => { 
    if (err) { 
      console.error('Error fetching doctors:', err); 
      return res.status(500).json({ error: 'Database error' }); 
    } 
    res.json(results); 
  }); 
}); 

// LAB OPERATIONS ====================================================================== 
app.post('/add-lab-test', authenticateToken, authorizeRoles("front_desk_view", "doctor_view", "admin"), (req, res) => { 
  const { patient_id, test_type, sub_type } = req.body; 
  const query1 = 'INSERT INTO lab (patient_id, test_type, sub_type) VALUES (?, ?, ?)'; 
  
  db.query(query1, [patient_id, test_type, sub_type], (err, result) => { 
    if (err) return res.status(500).json(err); 
    const query2 = 'UPDATE patient_list SET test_status = "Waiting" WHERE patient_id = ?'; 
    db.query(query2, [patient_id], (err2, result2) => { 
      if (err2) return res.status(500).json(err2); 
      res.json({ 
        message: "Lab test added & status updated", 
        labResult: result, 
        updateResult: result2 
      }); 
    }); 
  }); 
}); 

app.get('/waiting-lab-patients', authenticateToken, authorizeRoles("front_desk_view", "lab_view", "admin"), (req, res) => { 
  const query = "Select * from patient_list where test_status = 'Waiting'"; 
  db.query(query, (err, result) => { 
    if (err) return res.status(500).json(err); 
    res.json(result); 
  }); 
}); 

app.get('/lab-dept/:dept', authenticateToken, authorizeRoles("front_desk_view", "lab_view", "admin"), (req, res) => { 
  const { dept } = req.params; 
  const query = 'Select * from lab_test where department = ?'; 
  
  db.query(query, [dept], (err, result) => { 
    if (err) return res.status(500).json(err); 
    res.json(result); 
  }); 
}); 

app.get('/patient-lab-tests/:id', authenticateToken, authorizeRoles("front_desk_view", "lab_view", "admin"), (req, res) => { 
  const query = 'Select * from lab where patient_id = ?'; 
  const { id } = req.params; 

  db.query(query, [id], (err, result) => { 
    if (err) return res.status(500).json(err); 
    res.json(result); 
  }); 
}); 

app.post('/assign-lab-tech/:patientID/:labTechID', authenticateToken, authorizeRoles("front_desk_view", "admin"), (req, res) => { 
  const { patientID, labTechID } = req.params; 
  const query = ` 
    UPDATE patient_list  
    SET lab_tech_assigned = ?, test_status = 'Assigned'  
    WHERE patient_id = ? 
  `; 

  db.query(query, [labTechID, patientID], (err, results) => { 
    if (err) { 
      console.error(err); 
      return res.status(500).json(err); 
    } 
    if (results.affectedRows === 0) { 
      return res.status(404).json({ message: "Patient not found" }); 
    } 
    res.json({ message: "Assigned successfully", results }); 
  }); 
}); 

app.get('/all-lab-test', authenticateToken, authorizeRoles("front_desk_view", "lab_view", "admin"), (req, res) => { 
  const query = "Select * from lab"; 
  db.query(query, (err, result) => { 
    if (err) return res.status(500).json(err); 
    res.json(result); 
  }); 
}); 

app.get('/assigned-patients/:id', authenticateToken, authorizeRoles("lab_view", "admin"), (req, res) => { 
  const { id } = req.params; 
  const query = ` 
    SELECT  
      p.patient_id, 
      p.patient_name, 
      p.test_status, 
      l.test_type, 
      l.sub_type 
    FROM patient_list p 
    JOIN lab l ON p.patient_id = l.patient_id 
    WHERE p.lab_tech_assigned = ? 
    AND p.test_status !="Done" 
  `; 

  db.query(query, [id], (err, results) => { 
    if (err) return res.status(500).json(err); 
    res.json(results); 
  }); 
}); 

app.post("/upload", authenticateToken, authorizeRoles("lab_view", "front_desk_view", "admin"), upload.single("pdf"), (req, res) => { 
  const { patient_id, file_name } = req.body; 
  const file = req.file; 

  if (!file || !patient_id || !file_name) { 
    return res.status(400).send("Missing data");
  } 

  try { 
    const fileData = fs.readFileSync(file.path); 
    
    db.query( 
      "INSERT INTO results (patient_id, file_name, result_file, date) VALUES (?, ?, ?, CURDATE())", 
      [patient_id, file_name, fileData], 
      (err, result) => { 
        if (err) { 
          console.error(err); 
          return res.status(500).send("DB error");
        } 
        fs.unlinkSync(file.path); 
        res.send("Upload successful");
      } 
    ); 
  } catch (err) { 
    console.error(err); 
    res.status(500).send("Server error");
  } 
}); 

app.get("/results/:patient_id", authenticateToken, authorizeRoles("user", "lab_view", "doctor_view", "admin"), (req, res) => { 
  const patient_id = req.params.patient_id; 
  if (req.user.role === "user" && req.user.id !== patient_id) {
    return res.status(403).json({ message: "Access Denied" });
  }

  db.query( 
    "SELECT result_id, file_name, date FROM results WHERE patient_id = ?", 
    [patient_id], 
    (err, results) => { 
      if (err) { 
        console.error(err); 
        return res.status(500).send("Error fetching results");
      } 
      res.json(results); 
    } 
  ); 
}); 

app.get("/download/:id", authenticateToken, (req, res) => { 
  const id = req.params.id; 

  db.query( 
    "SELECT file_name, result_file, patient_id FROM results WHERE result_id = ?", 
    [id], 
    (err, results) => { 
      if (err) { 
        console.error(err); 
        return res.status(500).send("Error downloading file");
      } 

      if (results.length === 0) { 
        return res.status(404).send("File not found");
      } 

      const file = results[0]; 
      if (req.user.role === "user" && req.user.id !== file.patient_id) {
        return res.status(403).json({ message: "Access Denied: Unauthorized download" });
      }
      res.setHeader("Content-Type", "application/pdf"); 
      res.setHeader( 
        "Content-Disposition", 
        `attachment; filename="${file.file_name}"` 
      ); 
      res.send(file.result_file); 
    } 
  ); 
}); 

app.put("/update-test-status", authenticateToken, authorizeRoles("lab_view", "admin"), (req, res) => { 
  const { patient_id, status } = req.body; 

  if (!patient_id || !status) { 
    return res.status(400).send("Missing data");
  } 

  db.query( 
    "UPDATE patient_list SET test_status = ? WHERE patient_id = ?", 
    [status, patient_id], 
    (err, result) => { 
      if (err) { 
        console.error(err); 
        return res.status(500).send("DB error");
      } 
      res.send("Status updated successfully");
    } 
  ); 
}); 

app.get("/lab-ready-patients", authenticateToken, authorizeRoles("lab_view", "admin"), (req, res) => { 
  db.query( 
    "SELECT * FROM patient_list WHERE test_status = 'Ready'", 
    (err, results) => { 
      if (err) { 
        console.error(err); 
        return res.status(500).send("Error fetching ready patients");
      } 
      res.json(results); 
    } 
  ); 
}); 

// ADMIN PANELS (DASHBOARDS) ============================================================ 
app.get('/admin-view-doc', authenticateToken, authorizeRoles("admin"), (req, res) => { 
  const query = 'Select * from doctors'; 
  db.query(query, (err, results) => { 
    if (err) return res.status(500).json(err); 
    res.json(results); 
  }); 
}); 

app.get('/admin-view-med', authenticateToken, authorizeRoles("admin"), (req, res) => { 
  const query = 'Select * from med_dept'; 
  db.query(query, (err, results) => { 
    if (err) return res.status(500).json(err); 
    res.json(results); 
  }); 
}); 

app.get('/admin-view-front', authenticateToken, authorizeRoles("admin"), (req, res) => { 
  const query = 'Select * from front_desk'; 
  db.query(query, (err, results) => { 
    if (err) return res.status(500).json(err); 
    res.json(results); 
  }); 
}); 

app.get('/admin-view-lab', authenticateToken, authorizeRoles("admin"), (req, res) => { 
  const query = 'Select * from lab_test'; 
  db.query(query, (err, results) => { 
    if (err) return res.status(500).json(err); 
    res.json(results); 
  }); 
}); 

// ADMIN ADD STAFF ===================================================================== 
app.post('/add-doctor', authenticateToken, authorizeRoles("admin"), async (req, res) => { 
  const { doc_id, doc_name, specialization, password } = req.body; 

  if (!doc_id || !doc_name || !specialization || !password) { 
    return res.status(400).json("All fields are required"); 
  } 

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `CALL AddDoctor(?, ?, ?, ?)`; 
    db.query(query, [doc_id, doc_name, specialization, hashedPassword], (err, result) => { 
      if (err) { 
        console.log("Error:", err); 
        if (err.sqlMessage) { 
          return res.status(400).json(err.sqlMessage); 
        } 
        return res.status(500).json("Database error "); 
      } 
      res.status(200).json("Doctor added successfully "); 
    }); 
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error during registration");
  }
}); 

app.post('/add-lab-tech', authenticateToken, authorizeRoles("admin"), async (req, res) => { 
  const { lab_tech_id, name, department, password, role } = req.body; 

  if (!lab_tech_id || !name || !department || !password || !role) { 
    return res.status(400).json("All fields are required "); 
  } 
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `CALL AddLabTech(?, ?, ?, ?, ?)`; 
    db.query( 
      query, 
      [lab_tech_id, name, department, hashedPassword, role], 
      (err, result) => { 
        if (err) { 
          console.log("DB Error:", err); 
          if (err.sqlMessage) { 
            return res.status(400).json(err.sqlMessage); 
          } 
          return res.status(500).json("Database error "); 
        } 
        return res.status(200).json("Lab Tech added successfully "); 
      } 
    ); 
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error during registration");
  }
}); 

app.post('/add-front-desk', authenticateToken, authorizeRoles("admin"), async (req, res) => { 
  const { front_desk_id, name, password, role } = req.body; 

  if (!front_desk_id || !name || !password || !role) { 
    return res.status(400).json("All fields are required "); 
  } 

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `CALL AddFrontDesk(?, ?, ?, ?)`; 
    db.query( 
      query, 
      [front_desk_id, name, hashedPassword, role], 
      (err, result) => { 
        if (err) { 
          console.log("DB Error:", err); 
          if (err.sqlMessage) { 
            return res.status(400).json(err.sqlMessage); 
          } 
          return res.status(500).json("Database error "); 
        } 
        return res.status(200).json("Front Desk added successfully "); 
      } 
    ); 
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error during registration");
  }
}); 

app.post('/add-med-dept', authenticateToken, authorizeRoles("admin"), async (req, res) => { 
  const { med_dept_id, name, password, role } = req.body; 

  if (!med_dept_id || !name || !password || !role) { 
    return res.status(400).json("All fields are required "); 
  } 

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `CALL AddMedDept(?, ?, ?, ?)`; 
    db.query( 
      query, 
      [med_dept_id, name, hashedPassword, role], 
      (err, result) => { 
        if (err) { 
          console.log("DB Error:", err); 
          if (err.sqlMessage) { 
            return res.status(400).json(err.sqlMessage); 
          } 
          return res.status(500).json("Database error "); 
        } 
        return res.status(200).json("Medicine Dept added successfully "); 
      } 
    ); 
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error during registration");
  }
}); 

// ADMIN DELETE STAFF 
// ================================================ 
app.delete('/delete-doctor/:id', authenticateToken, authorizeRoles("admin"), (req, res) => { 
  const { id } = req.params; 
  if (!id) { 
    return res.status(400).json("Doctor ID is required "); 
  } 
  const query = `CALL DeleteDoctor(?)`; 
  db.query(query, [id], (err, result) => { 
    if (err) { 
      console.log("DB Error:", err); 
      if (err.sqlMessage) { 
        return res.status(400).json(err.sqlMessage); 
      } 
      return res.status(500).json("Database error "); 
    } 
    return res.status(200).json("Doctor deleted successfully "); 
  }); 
}); 

app.delete('/delete-lab-tech/:id', authenticateToken, authorizeRoles("admin"), (req, res) => { 
  const { id } = req.params; 
  if (!id) { 
    return res.status(400).json("Lab Tech ID is required "); 
  } 
  const query = `CALL DeleteLabTech(?)`; 
  db.query(query, [id], (err, result) => { 
    if (err) { 
      console.log("DB Error:", err); 
      if (err.sqlMessage) { 
        return res.status(400).json(err.sqlMessage); 
      } 
      return res.status(500).json("Database error "); 
    } 
    return res.status(200).json("Lab Tech deleted successfully "); 
  }); 
}); 

app.delete('/delete-front-desk/:id', authenticateToken, authorizeRoles("admin"), (req, res) => { 
  const { id } = req.params; 
  if (!id) { 
    return res.status(400).json("Front Desk ID is required "); 
  } 
  const query = `CALL DeleteFrontDesk(?)`; 
  db.query(query, [id], (err, result) => { 
    if (err) { 
      console.log("DB Error:", err); 
      if (err.sqlMessage) { 
        return res.status(400).json(err.sqlMessage); 
      } 
      return res.status(500).json("Database error "); 
    } 
    return res.status(200).json("Front Desk deleted successfully"); 
  }); 
}); 

app.delete('/delete-med-dept/:id', authenticateToken, authorizeRoles("admin"), (req, res) => { 
  const { id } = req.params; 
  const query = `CALL DeleteMedDept(?)`; 
  db.query(query, [id], (err) => { 
    if (err) return res.status(500).json(err); 
    res.json("Med Dept deleted "); 
  }); 
}); 

// PASSWORDS & ACCOUNT MANAGEMENT ===================================================== 
app.get("/user-password/:id", authenticateToken, authorizeRoles("user", "admin"), (req, res) => {
  const id = req.params.id;
  if (req.user.role === "user" && req.user.id !== id) {
    return res.status(403).json({ message: "Access Denied" });
  }
  const sql = "SELECT password FROM users WHERE user_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result[0]);
  });
});

app.put("/update-password/:id", authenticateToken, authorizeRoles("user", "admin"), async (req, res) => { 
  const id = req.params.id; 
  const { password } = req.body; 

  if (!password) { 
    return res.status(400).json({ error: "Password required" }); 
  } 

  if (req.user.role === "user" && req.user.id !== id) {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "UPDATE users SET password = ? WHERE user_id = ?"; 

    db.query(sql, [hashedPassword, id], (err, result) => { 
      if (err) { 
        console.log(err); 
        return res.status(500).json({ error: "Server error" }); 
      } 
      if (result.affectedRows === 0) { 
        return res.status(404).json({ error: "User not found" }); 
      } 
      res.json({ message: "Password updated successfully " }); 
    }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during password update" });
  }
}); 

// DASHBOARD STATS FOR FRONT DESK
app.get('/dashboard-stats', authenticateToken, authorizeRoles("front_desk_view", "admin"), (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM patient_list) AS totalPatients,
      (SELECT COUNT(*) FROM patient_list WHERE status = 'Waiting') AS waitingPatients,
      (SELECT COUNT(*) FROM patient_list WHERE test_status IN ('Waiting', 'Assigned')) AS activeLabTests,
      (SELECT COUNT(*) FROM doctors) AS availableDoctors,
      (SELECT COUNT(*) FROM patient_list WHERE status IN ('Done', 'Completed')) AS patientsConsulted,
      (SELECT COUNT(*) FROM patient_list WHERE test_status = 'Done') AS labTestsCompleted,
      (SELECT COUNT(*) FROM prescription) AS prescriptionsIssued,
      (SELECT COUNT(*) FROM lab) AS totalLabTests,
      (SELECT COUNT(*) FROM results) AS resultsUploaded
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching dashboard stats:", err);
      return res.status(500).json({ error: "Database error fetching stats" });
    }
    res.json(results[0]);
  });
});

// ASSIGN DOCTOR ENDPOINT FOR FRONT DESK
app.put('/assign-doctor', authenticateToken, authorizeRoles("front_desk_view", "admin"), (req, res) => {
  const { patient_id, doc_assigned, specialization } = req.body;
  if (!patient_id || !doc_assigned || !specialization) {
    return res.status(400).json({ error: "Missing required fields: patient_id, doc_assigned, specialization" });
  }
  const sql = "UPDATE patient_list SET doc_assigned = ?, specialization = ?, status = 'Waiting' WHERE patient_id = ?";
  db.query(sql, [doc_assigned, specialization, patient_id], (err, result) => {
    if (err) {
      console.error("Error assigning doctor:", err);
      return res.status(500).json({ error: "Database error assigning doctor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ message: "Doctor assigned successfully " });
  });
});

console.log("SERVER.JS STARTED");
require("dotenv").config();
console.log("ENV LOADED");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
