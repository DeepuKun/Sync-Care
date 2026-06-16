import React, { useState } from 'react'
import '../components/css_folder/add_patient.css'
import { motion } from 'framer-motion';
const Add_Patient = () => {
  const [patientData , setPatientData] = useState({
    patient_id : "",
    patient_name : "",
    address : "",
    doc_assigned : "",
    specialization : "",
  })


  const handleChange=(e)=>{
    setPatientData(prev=>({
      ...prev,
      [e.target.name]: e.target.value 
    })) 
  }

  const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:5000/add-patient',{
         method :"POST",
         headers : {
          "Content-Type" : "application/json"
         },
         body : JSON.stringify(patientData)

      })

      if(response.ok){
        alert("Patient Added Succesfully!")
        setPatientData({
    patient_id : "",
    patient_name : "",
    address : "",
    doc_assigned : "",
    specialization : "",
  })
      }
      else{
        alert("Failed to insert Data !")
      }
     
    }
    catch(error){
      alert("Server Error!")
    }
  }

  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div className='add_patient_body'>
       <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Front Desk</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div>
        <form className='add_patient' onSubmit={handleSubmit}>
        <h2>Enter Patient Data...</h2>
        <input 
        name="patient_id"
        value={patientData.patient_id}
        placeholder='   Enter Patient ID...'
        onChange={handleChange}>
        </input>
        <input 
        name="patient_name"
        value={patientData.patient_name}
        placeholder='   Enter Patient Name...'
        onChange={handleChange}>
        </input>
        <input 
        name="address"
        value={patientData.address}
        placeholder='   Enter Patient Address...'
        onChange={handleChange}>
        </input>
        <input 
        name="doc_assigned"
        value={patientData.doc_assigned }
        placeholder='   Enter the Assigned Doctor...'
        onChange={handleChange}>
        </input>
        <input 
        name="specialization"
        value={patientData.specialization}
        placeholder='   Enter specialization...'
        onChange={handleChange}>
        </input>
        <button type='submit'>Submit</button>
       </form>
      </div>
    </div>
    </motion.div>
  )
}

export default Add_Patient
