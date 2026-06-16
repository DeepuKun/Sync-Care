import React, { useEffect, useState } from 'react';
import '../components/css_folder/patients.css'
const All_Doctors = () => {
  const [patients, setPatients] = useState([]); // store fetched data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state

  // Fetch data from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/every-doctors'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPatients(data); // save data in state
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Loading patients... ⏳</div>;
  if (error) return <div>Error: {error} ❌</div>;

  return (
    <>
                <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>All Doctors</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='all-patient-container'>
    <div className='all-patients' style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>All Doctors</h1>
      {patients.length === 0 ? (
        <p>No doctors found...</p>
      ) : (
        <table style={{ width: '70%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Assigned Patients</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patient_id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient.doc_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient.doc_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient.assigned_patients}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient.specialization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
    </>
  );
};

export default All_Doctors;