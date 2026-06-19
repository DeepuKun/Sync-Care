import React, { useState, useEffect } from 'react';
import '../components/css_folder/front_desk.css';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faUserClock, 
  faFlask, 
  faUserMd, 
  faPlus, 
  faSearch, 
  faUpload, 
  faArrowRight, 
  faCheckCircle, 
  faTimes, 
  faFileAlt, 
  faEye, 
  faStethoscope, 
  faCalendarAlt,
  faClock,
  faClipboardList,
  faVial,
  faCheck,
  faHospital,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

const Front_desk_view = () => {
  // Stats state
  const [stats, setStats] = useState({
    totalPatients: 0,
    waitingPatients: 0,
    activeLabTests: 0,
    availableDoctors: 0,
    patientsConsulted: 0,
    labTestsCompleted: 0,
    prescriptionsIssued: 0,
    totalLabTests: 0,
    resultsUploaded: 0
  });

  // Table states
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'assignDoctor', 'sendToLab', 'uploadResult', 'viewPatient'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [patientResults, setPatientResults] = useState([]);

  // Form states
  const [assignDocForm, setAssignDocForm] = useState({ patientId: '', doctorId: '' });
  const [sendLabForm, setSendLabForm] = useState({ patientId: '', testType: '', subType: '' });
  const [uploadForm, setUploadForm] = useState({ patientId: '', fileName: '', pdfFile: null });

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, patientsRes, doctorsRes] = await Promise.all([
        fetch('http://localhost:5000/dashboard-stats'),
        fetch('http://localhost:5000/every-patients'),
        fetch('http://localhost:5000/every-doctors')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        setPatients(patientsData);
      }
      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      patient.patient_id.toLowerCase().includes(query) ||
      patient.patient_name.toLowerCase().includes(query) ||
      (patient.doc_assigned && patient.doc_assigned.toLowerCase().includes(query)) ||
      (patient.specialization && patient.specialization.toLowerCase().includes(query))
    );
  });

  // Limit patients to waiting queue status
  const waitingQueuePatients = filteredPatients.filter(p => 
    p.status === 'Waiting' || p.status === 'Consulting' || p.status === 'Lab Test'
  );

  // Doctor's active patient calculation
  const getDoctorActiveCount = (docId) => {
    return patients.filter(p => p.doc_assigned === docId && p.status !== 'Done' && p.status !== 'Completed').length;
  };

  // View patient details & fetch clinical history
  const handleViewPatientDetails = async (patient) => {
    setSelectedPatient(patient);
    setActiveModal('viewPatient');
    setPatientPrescriptions([]);
    setPatientResults([]);
    try {
      const [presRes, resultsRes] = await Promise.all([
        fetch(`http://localhost:5000/prescription/${patient.patient_id}`),
        fetch(`http://localhost:5000/results/${patient.patient_id}`)
      ]);
      if (presRes.ok) {
        const presData = await presRes.json();
        setPatientPrescriptions(presData);
      }
      if (resultsRes.ok) {
        const resultsData = await resultsRes.json();
        setPatientResults(resultsData);
      }
    } catch (err) {
      console.error("Failed to load patient history:", err);
    }
  };

  // Handlers for modal submissions
  const submitAssignDoctor = async (e) => {
    e.preventDefault();
    if (!assignDocForm.patientId || !assignDocForm.doctorId) {
      alert("Please enter patient ID and select a doctor");
      return;
    }
    const doc = doctors.find(d => d.doc_id === assignDocForm.doctorId);
    if (!doc) return;

    try {
      const res = await fetch('http://localhost:5000/assign-doctor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: assignDocForm.patientId,
          doc_assigned: doc.doc_id,
          specialization: doc.specialization
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Doctor assigned successfully! Patient status is now Waiting.");
        setActiveModal(null);
        setAssignDocForm({ patientId: '', doctorId: '' });
        fetchData();
      } else {
        alert(data.error || "Failed to assign doctor");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const submitSendToLab = async (e) => {
    e.preventDefault();
    if (!sendLabForm.patientId || !sendLabForm.testType || !sendLabForm.subType) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/add-lab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: sendLabForm.patientId,
          test_type: sendLabForm.testType,
          sub_type: sendLabForm.subType
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Patient successfully sent to Lab! Lab Test created.");
        setActiveModal(null);
        setSendLabForm({ patientId: '', testType: '', subType: '' });
        fetchData();
      } else {
        alert(data.error || "Failed to send to lab");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const submitUploadResult = async (e) => {
    e.preventDefault();
    if (!uploadForm.patientId || !uploadForm.fileName || !uploadForm.pdfFile) {
      alert("Please fill in all fields and select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append('patient_id', uploadForm.patientId);
    formData.append('file_name', uploadForm.fileName);
    formData.append('pdf', uploadForm.pdfFile);

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.text();
      if (res.ok) {
        alert("Lab result PDF uploaded successfully!");
        // Update patient test_status to Done
        await fetch('http://localhost:5000/update-test-status', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient_id: uploadForm.patientId, status: 'Done' })
        });
        setActiveModal(null);
        setUploadForm({ patientId: '', fileName: '', pdfFile: null });
        fetchData();
      } else {
        alert(data || "Failed to upload result");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Waiting': return 'status-badge status-waiting';
      case 'Consulting': return 'status-badge status-consulting';
      case 'Completed': 
      case 'Done': return 'status-badge status-completed';
      case 'Lab Test': return 'status-badge status-lab';
      default: return 'status-badge';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='front_desk_main'>
        {/* HEADER */}
        <div className='doc_header front_desk_header'>
          <img className='doc_page_logo' src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg' alt="Everlight Logo" />
          <h2>Ever<span className='light'>light</span> Hospital</h2>
          <h2>|</h2>
          <h2>Front Desk</h2>
          <div className='front_desk_search_wrapper'>
            <FontAwesomeIcon icon={faSearch} className="search_bar_icon" />
            <input 
              placeholder='Search Patients by Name/ID...' 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <img className='front_desk_profile_icon' src='https://i.pinimg.com/736x/23/d1/3a/23d13a1dbad6a60319413ec2512aed29.jpg' alt="User Avatar" />
        </div>

        {/* HERO BODY */}
        <div className='front_desk_hero_container'>
          {/* LEFT PANELS (Action blocks - UNCHANGED) */}
          <div className='front_desk_hero'>
            <div className='front_desk_division'>
              <h2>Patients : </h2>
              <NavLink to='/add-patient'>
                <button>Add Patients</button>
              </NavLink>
              <NavLink to='/ready-patients'>
                <button>Ready Queue</button>
              </NavLink>
              <NavLink to='/every-patients'>
                <button>All Patients</button>
              </NavLink>
            </div>

            <div className='front_desk_division'>
              <h2>Doctors : </h2>
              <NavLink to='/every-doctors'>
                <button>All Doctors</button>
              </NavLink>
              <NavLink to='/search-doctors'>
                <button>Search Doctors</button>
              </NavLink>
              <button onClick={() => alert("Direct paging contact system initializing...")}>Contact Doctors</button>
            </div>

            <div className='front_desk_division'>
              <h2>Lab Test : </h2>
              <NavLink to='/front-lab-page'>
                <button>Waiting Patients</button>
              </NavLink> 
              <NavLink to="/lab-ready-queue">
                <button>Ready Queue</button>
              </NavLink>
              <NavLink to='/all-lab-test'>
                <button>All Lab Test</button>
              </NavLink>
            </div>
          </div>

          {/* RIGHT DASHBOARD (NEW FUNCTIONAL DASHBOARD SECTION) */}
          <div className='front_desk_dashboard'>
            {loading ? (
              <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Syncing dashboard with Everlight database... ⏳</p>
              </div>
            ) : (
              <div className="dashboard-grid">
                
                {/* 1. TOP STATISTICS ROW */}
                <div className="stats-row">
                  <div className="stat-card">
                    <div className="stat-icon-wrapper pat-color">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.totalPatients}</h3>
                      <p>Total Patients Today</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper wait-color">
                      <FontAwesomeIcon icon={faUserClock} />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.waitingPatients}</h3>
                      <p>Waiting Patients</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper lab-color">
                      <FontAwesomeIcon icon={faFlask} />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.activeLabTests}</h3>
                      <p>Active Lab Tests</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper doc-color">
                      <FontAwesomeIcon icon={faUserMd} />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.availableDoctors}</h3>
                      <p>Available Doctors</p>
                    </div>
                  </div>
                </div>

                {/* TWO COLUMN GRID */}
                <div className="dashboard-layout-body">
                  
                  {/* LEFT SUB-COLUMN: Patient tables */}
                  <div className="dashboard-col-left">
                    
                    {/* 2. PATIENT QUEUE PANEL */}
                    <div className="dashboard-card panel-patient-queue">
                      <div className="panel-header">
                        <h2>
                          <FontAwesomeIcon icon={faUserClock} className="header-icon" /> 
                          Patient Consultation Queue
                        </h2>
                        <span className="badge-count">{waitingQueuePatients.length} Active</span>
                      </div>
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Patient ID</th>
                              <th>Name</th>
                              <th>Assigned Doctor</th>
                              <th>Specialization</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {waitingQueuePatients.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="text-center">No patients currently in consultation queue.</td>
                              </tr>
                            ) : (
                              waitingQueuePatients.map(patient => (
                                <tr key={patient.patient_id}>
                                  <td><strong>{patient.patient_id}</strong></td>
                                  <td>{patient.patient_name}</td>
                                  <td>{patient.doc_assigned || 'Not Assigned'}</td>
                                  <td>{patient.specialization || 'N/A'}</td>
                                  <td>
                                    <span className={getStatusClass(patient.status)}>
                                      {patient.status}
                                    </span>
                                  </td>
                                  <td>
                                    <button 
                                      className="btn-view" 
                                      onClick={() => handleViewPatientDetails(patient)}
                                    >
                                      <FontAwesomeIcon icon={faEye} style={{ marginRight: '5px' }} />
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 7. RECENT PATIENTS PANEL */}
                    <div className="dashboard-card panel-recent-patients">
                      <div className="panel-header">
                        <h2>
                          <FontAwesomeIcon icon={faHospital} className="header-icon" />
                          Recent Registrations
                        </h2>
                        <span className="badge-count">Latest {Math.min(filteredPatients.length, 5)}</span>
                      </div>
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Patient ID</th>
                              <th>Name</th>
                              <th>Assigned Doctor</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPatients.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="text-center">No patient records found.</td>
                              </tr>
                            ) : (
                              filteredPatients.slice(0, 5).map(patient => (
                                <tr key={patient.patient_id}>
                                  <td><strong>{patient.patient_id}</strong></td>
                                  <td>{patient.patient_name}</td>
                                  <td>{patient.doc_assigned || 'Not Assigned'}</td>
                                  <td>
                                    <span className={getStatusClass(patient.status)}>
                                      {patient.status}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT SUB-COLUMN: Stats & Doctor statuses */}
                  <div className="dashboard-col-right">

                    {/* 5. QUICK ACTIONS PANEL */}
                    <div className="dashboard-card panel-quick-actions">
                      <div className="panel-header">
                        <h2>
                          <FontAwesomeIcon icon={faPlus} className="header-icon" />
                          Quick Actions
                        </h2>
                      </div>
                      <div className="quick-actions-buttons-grid">
                        <NavLink to='/add-patient' className="action-btn">
                          <FontAwesomeIcon icon={faUserPlus} className="act-icon" />
                          <span>Register Patient</span>
                        </NavLink>
                        
                        <button onClick={() => setActiveModal('assignDoctor')} className="action-btn">
                          <FontAwesomeIcon icon={faUserMd} className="act-icon" />
                          <span>Assign Doctor</span>
                        </button>
                        
                        <button onClick={() => setActiveModal('sendToLab')} className="action-btn">
                          <FontAwesomeIcon icon={faFlask} className="act-icon" />
                          <span>Send To Lab</span>
                        </button>
                        
                        <NavLink to='/every-patients' className="action-btn">
                          <FontAwesomeIcon icon={faUser} className="act-icon" />
                          <span>All Patients</span>
                        </NavLink>
                        
                        <button onClick={() => {
                          const searchBox = document.querySelector('.front_desk_search_wrapper input');
                          if (searchBox) searchBox.focus();
                        }} className="action-btn">
                          <FontAwesomeIcon icon={faSearch} className="act-icon" />
                          <span>Search Patient</span>
                        </button>
                        
                        <button onClick={() => setActiveModal('uploadResult')} className="action-btn">
                          <FontAwesomeIcon icon={faUpload} className="act-icon" />
                          <span>Upload Result</span>
                        </button>
                      </div>
                    </div>

                    {/* 6. TODAY'S ACTIVITY PANEL */}
                    <div className="dashboard-card panel-activity">
                      <div className="panel-header">
                        <h2>
                          <FontAwesomeIcon icon={faClipboardList} className="header-icon" />
                          Today's Activity
                        </h2>
                      </div>
                      <div className="activity-list">
                        <div className="activity-item">
                          <div className="activity-marker blue-dot"></div>
                          <div className="activity-details">
                            <span className="activity-title">Patients Registered Today</span>
                            <span className="activity-value font-bold">{stats.totalPatients}</span>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-marker green-dot"></div>
                          <div className="activity-details">
                            <span className="activity-title">Patients Consulted</span>
                            <span className="activity-value font-bold text-green">{stats.patientsConsulted}</span>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-marker purple-dot"></div>
                          <div className="activity-details">
                            <span className="activity-title">Lab Tests Completed</span>
                            <span className="activity-value font-bold text-purple">{stats.labTestsCompleted}</span>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-marker orange-dot"></div>
                          <div className="activity-details">
                            <span className="activity-title">Prescriptions Issued</span>
                            <span className="activity-value font-bold text-orange">{stats.prescriptionsIssued}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. LAB TEST OVERVIEW */}
                    <div className="dashboard-card panel-lab-overview">
                      <div className="panel-header">
                        <h2>
                          <FontAwesomeIcon icon={faVial} className="header-icon" />
                          Lab Test Summary
                        </h2>
                      </div>
                      <div className="lab-mini-cards">
                        <div className="mini-card flex-1">
                          <h4>{stats.totalLabTests}</h4>
                          <p>Total Lab Tests</p>
                        </div>
                        <div className="mini-card flex-1 orange-border">
                          <h4>{stats.activeLabTests}</h4>
                          <p>Waiting for Results</p>
                        </div>
                        <div className="mini-card flex-1 green-border">
                          <h4>{stats.resultsUploaded}</h4>
                          <p>Results Uploaded</p>
                        </div>
                      </div>
                    </div>

                    {/* 4. DOCTOR STATUS PANEL */}
                    <div className="dashboard-card panel-doctors">
                      <div className="panel-header">
                        <h2>
                          <FontAwesomeIcon icon={faUserMd} className="header-icon" />
                          Doctor Availability
                        </h2>
                      </div>
                      <div className="doctor-status-list">
                        {doctors.length === 0 ? (
                          <div className="text-center p-2">No doctor records registered.</div>
                        ) : (
                          doctors.slice(0, 5).map(doc => {
                            const activeCount = getDoctorActiveCount(doc.doc_id);
                            return (
                              <div className="doctor-status-item" key={doc.doc_id}>
                                <div className="doc-avatar">
                                  <FontAwesomeIcon icon={faUserMd} />
                                </div>
                                <div className="doc-meta">
                                  <h4>{doc.doc_name}</h4>
                                  <p>{doc.specialization}</p>
                                </div>
                                <div className="doc-queue-info">
                                  <span className={`queue-badge ${activeCount > 3 ? 'high-load' : 'normal-load'}`}>
                                    {activeCount} Patients
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className='front_desk_footer'>
          <div className='front_desk_footer_left'>
            <p>No. of beds available : 20</p>
            <p>Other Hospitals Contact Info : 9090123232, 849834980</p>
          </div>
          <div className='front_desk_footer_right'>
            <button className="btn-emergency" onClick={() => alert("EMERGENCY BROADCAST TRANSMITTED! 🚨 All departments alerted.")}>EMERGENCY!</button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL DIALOGS */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setActiveModal(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>

              {/* A. ASSIGN DOCTOR MODAL */}
              {activeModal === 'assignDoctor' && (
                <form onSubmit={submitAssignDoctor}>
                  <h3>Assign Doctor to Patient</h3>
                  <div className="form-group">
                    <label>Patient ID / Aadhar Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 123456789012"
                      value={assignDocForm.patientId}
                      onChange={(e) => setAssignDocForm({ ...assignDocForm, patientId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Select Consulting Doctor</label>
                    <select 
                      value={assignDocForm.doctorId}
                      onChange={(e) => setAssignDocForm({ ...assignDocForm, doctorId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Doctor --</option>
                      {doctors.map(doc => (
                        <option key={doc.doc_id} value={doc.doc_id}>
                          {doc.doc_name} ({doc.specialization})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn-modal-submit">Confirm Assignment</button>
                </form>
              )}

              {/* B. SEND TO LAB MODAL */}
              {activeModal === 'sendToLab' && (
                <form onSubmit={submitSendToLab}>
                  <h3>Send Patient to Laboratory</h3>
                  <div className="form-group">
                    <label>Patient ID / Aadhar Number</label>
                    <input 
                      type="text"
                      placeholder="Enter patient ID..."
                      value={sendLabForm.patientId}
                      onChange={(e) => setSendLabForm({ ...sendLabForm, patientId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Lab Test Type</label>
                    <input 
                      type="text"
                      placeholder="e.g. Hematology, Radiology, Biochemistry"
                      value={sendLabForm.testType}
                      onChange={(e) => setSendLabForm({ ...sendLabForm, testType: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Sub Test Name / Profile</label>
                    <input 
                      type="text"
                      placeholder="e.g. Complete Blood Count, Chest X-Ray"
                      value={sendLabForm.subType}
                      onChange={(e) => setSendLabForm({ ...sendLabForm, subType: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-modal-submit">Send to Lab Tech</button>
                </form>
              )}

              {/* C. UPLOAD LAB RESULT MODAL */}
              {activeModal === 'uploadResult' && (
                <form onSubmit={submitUploadResult}>
                  <h3>Upload Patient Lab Result</h3>
                  <div className="form-group">
                    <label>Patient ID / Aadhar Number</label>
                    <input 
                      type="text"
                      placeholder="Enter patient ID..."
                      value={uploadForm.patientId}
                      onChange={(e) => setUploadForm({ ...uploadForm, patientId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Lab Test File Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Blood_Report_P001.pdf"
                      value={uploadForm.fileName}
                      onChange={(e) => setUploadForm({ ...uploadForm, fileName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Select Report PDF Document</label>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={(e) => setUploadForm({ ...uploadForm, pdfFile: e.target.files[0] })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-modal-submit">Upload & Approve</button>
                </form>
              )}

              {/* D. VIEW PATIENT DETAILS MODAL */}
              {activeModal === 'viewPatient' && selectedPatient && (
                <div className="patient-details-view">
                  <div className="pat-header-info">
                    <div className="pat-avatar-large">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div>
                      <h2>{selectedPatient.patient_name}</h2>
                      <p className="pat-sub">Patient ID: <strong>{selectedPatient.patient_id}</strong></p>
                    </div>
                    <span className={getStatusClass(selectedPatient.status)}>
                      {selectedPatient.status}
                    </span>
                  </div>

                  <div className="pat-detail-grid">
                    <div className="detail-item">
                      <label>Address</label>
                      <p>{selectedPatient.address || 'N/A'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Consulting Doctor</label>
                      <p>{selectedPatient.doc_assigned || 'Not Assigned'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Specialization</label>
                      <p>{selectedPatient.specialization || 'N/A'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Lab Test Status</label>
                      <p className="text-purple">{selectedPatient.test_status || 'No test ordered'}</p>
                    </div>
                  </div>

                  {/* Clinical Data Section */}
                  <div className="pat-clinical-sections">
                    <div className="clinical-col">
                      <h4><FontAwesomeIcon icon={faClipboardList} /> Prescriptions Issued</h4>
                      {patientPrescriptions.length === 0 ? (
                        <p className="text-muted">No prescriptions issued for this patient.</p>
                      ) : (
                        <div className="clinical-items-list">
                          {patientPrescriptions.map(pres => (
                            <div className="clinical-item" key={pres.pres_id}>
                              <strong>{pres.medicine_name}</strong>
                              <p className="dose-label">Doses: M:{pres.morning} N:{pres.noon} E:{pres.evening} N:{pres.night}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="clinical-col">
                      <h4><FontAwesomeIcon icon={faFlask} /> Lab Results Uploaded</h4>
                      {patientResults.length === 0 ? (
                        <p className="text-muted">No lab results uploaded yet.</p>
                      ) : (
                        <div className="clinical-items-list">
                          {patientResults.map(res => (
                            <div className="clinical-item flex justify-between" key={res.result_id}>
                              <div>
                                <strong>{res.file_name}</strong>
                                <p className="dose-label">Date: {new Date(res.date).toLocaleDateString()}</p>
                              </div>
                              <a 
                                href={`http://localhost:5000/download/${res.result_id}?token=${localStorage.getItem("token")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="download-btn-link"
                              >
                                <FontAwesomeIcon icon={faUpload} style={{ transform: 'rotate(180deg)', marginRight: '4px' }} />
                                Download PDF
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Front_desk_view;
