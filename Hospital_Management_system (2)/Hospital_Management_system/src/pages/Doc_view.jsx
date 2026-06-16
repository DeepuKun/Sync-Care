import React, { useState,useEffect } from 'react'
import '../components/css_folder/doc.css'
import { NavLink, useParams } from "react-router-dom";
import { motion } from 'framer-motion';

//add-doctor profile, user profile 
//add a chat option in doctor side bar

const Doc_view = () => {

const doc_id = localStorage.getItem("userId");
const [patients, setPatients] = useState([]);
const [sideBar, setSideBar] = useState(false);
const [docData, setDocData]= useState([]);
const [inputBar, setInputbar] = useState(false);
const [patientID, setPatientID] = useState();
const [p_id,setP_id] = useState();

const handleDeletePrescriptionSubmit=(e)=>{
  e.preventDefault();
  alert(`Patient ID : ${p_id}'s All Prescriptions Are Successfully Deleted... `)
  fetch(`http://localhost:5000/delete-prescription/${p_id}`, {method:"DELETE"})
    .then(res => res.json())
  .then(data => {
    console.log("Deleted:", data);
  })
  .catch(err => console.log(err));
}
const toggleSidebar = () => {
  setSideBar(!sideBar);
};

  useEffect(() => {
    fetch(`http://localhost:5000/doctor-info/${doc_id}`)
      .then(res => res.json())
      .then(data => setDocData(data[0]))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/patients/${doc_id}`)
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(err => console.error(err));
  }, []);


  const updateStatus = async (id, newStatus) => {
  try {
    await fetch(`http://localhost:5000/patients/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus })
    });

    // Update UI instantly without refresh
    setPatients(prevPatients =>
      prevPatients.map(p =>
        p.patient_id === id ? { ...p, status: newStatus } : p
      )
    );

  } catch (error) {
    console.error("Error updating status:", error);
  }
};

const initialFormState = {
  patient_id: "",
  medicine_name: "",
  morning: "",
  noon: "",
  evening: "",
  night: ""
};
const [formData, setFormData] = useState(initialFormState);
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/prescription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error(error);
  }

  setFormData(initialFormState);
};

  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div>
      <div className='doc_header'>
          <img className='doc_page_logo' src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h2>Ever<span className='light'>light</span> Hospital</h2>
          <h2>|</h2>
          <h2>Doctor Dashboard</h2>
          <form onSubmit={handleDeletePrescriptionSubmit}>
          <input onChange={(e)=>setP_id(e.target.value)} onClick={()=>{setInputbar(!inputBar)}} className={`${inputBar? 'expand_input' : " "}`} placeholder='   Seacrh Patient...'></input>
          <button type='submit' className='Delete_prescription'>Delete Prescription</button>
          </form>
          
          <img className='doc_profile_icon' onClick={()=>toggleSidebar()} src='https://i.pinimg.com/736x/23/d1/3a/23d13a1dbad6a60319413ec2512aed29.jpg'></img>
        </div>
        <div className={`doc_profile_sidebar ${sideBar? 'active' : ''}`}>
                    <div className='doc_name_area'>
            <img className='doc_profile_pic2' src='https://i.pinimg.com/1200x/e3/5d/19/e35d191a414645f5ef13de6026ba3f80.jpg'></img>
            <h2>{docData.doc_name}</h2>
          </div>  
          <br></br>
          <br></br>
                    <br></br>
          <br></br>
                  <table>
  <tr>
    <th>Name</th>
    <th>Doctor's ID</th>
    <th>Specialization</th>
    <th>Assigned Patients</th>
  </tr>

  <tr>
    <td>{docData.doc_name}</td>
    <td>{docData.doc_id}</td>
    <td>{docData.specialization}</td>
    <td>{docData.assigned_patients}</td>

  </tr>
</table>

          <img  className='doc_profile_pic1' src='https://i.pinimg.com/originals/be/ed/29/beed2992cbb81ca9adac47d97cd59c9a.gif'></img>
          <button> Chat with Patients and Front Desk </button>


         

        </div>
    <div className="doc_view_container">
      <div className='doc_left'>
      <div className='doc_pateint'>
        <h3>Patient List : </h3>
      {patients.map((patient) => (
        <div key={patient.patient_id} className="doc_card">
          <div className='doc_patient_info'>
            <img className='doc_patient_logo' src="https://i.pinimg.com/736x/c8/90/07/c89007d6ffc9116b9465a227a73fab0a.jpg"></img><p>{patient.patient_name} - {patient.specialization}</p>
          </div>
          <p>Patient ID : {patient.patient_id} </p>
          <div className="status_buttons">
  <button className='doc_status ready' onClick={() => updateStatus(patient.patient_id, "Ready")}>
    Ready
  </button>

  <button className='doc_status done' onClick={() => updateStatus(patient.patient_id, "Done")}>
    Done
  </button>
</div>

<p>Status: {patient.status}</p>
        </div>
      ))}
      </div>
    </div>

      <form onSubmit={handleSubmit}>
        <div className='doc_right'>
        <h3> Add Prescription : </h3>
      <div className='doc_prescription'>
        <input 
        name="patient_id"
        value={formData.patient_id}
        onChange={handleChange}
        placeholder='   Enter Pateint Id...'>
        </input>
        <input
        name="medicine_name"
        value={formData.medicine_name}
        onChange={handleChange}
         placeholder='   Medicine Name...'></input>
      </div>
        <h3>Doses : </h3>
        <div className='doc_doses'>
          <input 
          name="morning"
          value={formData.morning}
          onChange={handleChange}
          placeholder='   Morning...'></input>
        <input 
        name="noon"
        value={formData.noon}
        onChange={handleChange}
        placeholder='   Noon...'></input>
        <input 
        name="evening"
        value={formData.evening}
        onChange={handleChange}
        placeholder='   Evening...'></input>
        <input 
        name="night"
        value={formData.night}
        onChange={handleChange}
        placeholder='   Night...'></input>
        </div>
        <button className='doc_prescription_submit' type='submit'> Done Prescription </button>
        <NavLink to={'/add-lab-test'}><button className='doc_prescription_submit'>Add Lab Test</button></NavLink>
            </div>
      </form>
       
    </div>
    </div>
    </motion.div>
  )
}

export default Doc_view
