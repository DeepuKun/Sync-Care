import React, { useEffect, useState } from 'react'

const Lab_ready_queue = () => {

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/lab-ready-patients")
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className='Lab-ready-container'>
      <div className='login_page_header norole_header prescription_search_header'>
        <img src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
        <h1>Ever<span className='light'>light</span> Hospital</h1>
        <h3>powered by <span className='synccare'>SyncCare</span></h3>
        <h1>|</h1>
        <h1>Lab Ready Queue</h1>
        <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>

      <div>
        <table className="assigned-patient-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient, index) => (
              <tr key={index}>
                <td>{patient.patient_id}</td>
                <td>{patient.patient_name}</td>
                <td>{patient.test_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Lab_ready_queue