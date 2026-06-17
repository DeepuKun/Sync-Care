-- Database Schema for Sync-Care Hospital Management System


-- 1. Users Table (Auth credentials)
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(100) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    doc_id VARCHAR(100) PRIMARY KEY,
    doc_name VARCHAR(150) NOT NULL,
    specialization VARCHAR(150) NOT NULL
);

-- 3. Patient List Table
CREATE TABLE IF NOT EXISTS patient_list (
    patient_id VARCHAR(100) PRIMARY KEY,
    patient_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    doc_assigned VARCHAR(100) NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    status VARCHAR(50) DEFAULT 'Waiting',
    test_status VARCHAR(50) DEFAULT NULL,
    lab_tech_assigned VARCHAR(100) DEFAULT NULL,
    result_date DATE DEFAULT NULL
);

-- 4. Medicine Table
CREATE TABLE IF NOT EXISTS medicine (
    med_id VARCHAR(100) PRIMARY KEY,
    med_name VARCHAR(150) NOT NULL,
    available INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    expiry_date DATE DEFAULT NULL
);

-- 5. Med Dept (Pharmacists) Table
CREATE TABLE IF NOT EXISTS med_dept (
    med_dept_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

-- 6. Prescription Table
CREATE TABLE IF NOT EXISTS prescription (
    pres_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(100) NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    morning VARCHAR(50) DEFAULT '0',
    noon VARCHAR(50) DEFAULT '0',
    evening VARCHAR(50) DEFAULT '0',
    night VARCHAR(50) DEFAULT '0'
);

-- 7. Lab (Patient Lab Tests) Table
CREATE TABLE IF NOT EXISTS lab (
    lab_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(100) NOT NULL,
    test_type VARCHAR(150) NOT NULL,
    sub_type VARCHAR(150) NOT NULL
);

-- 8. Lab Test (Lab Techs) Table
CREATE TABLE IF NOT EXISTS lab_test (
    lab_tech_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL
);

-- 9. Front Desk Table
CREATE TABLE IF NOT EXISTS front_desk (
    front_desk_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

-- 10. Results Table (PDF upload files)
CREATE TABLE IF NOT EXISTS results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    result_file LONGBLOB NOT NULL,
    date DATE NOT NULL
);


-- =========================================================================
-- STORED PROCEDURES
-- =========================================================================

-- Drop procedures if they already exist
DROP PROCEDURE IF EXISTS AddDoctor;
DROP PROCEDURE IF EXISTS AddLabTech;
DROP PROCEDURE IF EXISTS AddFrontDesk;
DROP PROCEDURE IF EXISTS AddMedDept;
DROP PROCEDURE IF EXISTS DeleteDoctor;
DROP PROCEDURE IF EXISTS DeleteLabTech;
DROP PROCEDURE IF EXISTS DeleteFrontDesk;
DROP PROCEDURE IF EXISTS DeleteMedDept;

DELIMITER //

-- Add Doctor
CREATE PROCEDURE AddDoctor(
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
END //

-- Add Lab Tech
CREATE PROCEDURE AddLabTech(
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
END //

-- Add Front Desk
CREATE PROCEDURE AddFrontDesk(
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
END //

-- Add Med Dept
CREATE PROCEDURE AddMedDept(
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
END //

-- Delete Doctor
CREATE PROCEDURE DeleteDoctor(IN p_id VARCHAR(100))
BEGIN
    DELETE FROM doctors WHERE doc_id = p_id;
    DELETE FROM users WHERE user_id = p_id;
END //

-- Delete Lab Tech
CREATE PROCEDURE DeleteLabTech(IN p_id VARCHAR(100))
BEGIN
    DELETE FROM lab_test WHERE lab_tech_id = p_id;
    DELETE FROM users WHERE user_id = p_id;
END //

-- Delete Front Desk
CREATE PROCEDURE DeleteFrontDesk(IN p_id VARCHAR(100))
BEGIN
    DELETE FROM front_desk WHERE front_desk_id = p_id;
    DELETE FROM users WHERE user_id = p_id;
END //

-- Delete Med Dept
CREATE PROCEDURE DeleteMedDept(IN p_id VARCHAR(100))
BEGIN
    DELETE FROM med_dept WHERE med_dept_id = p_id;
    DELETE FROM users WHERE user_id = p_id;
END //

DELIMITER ;
