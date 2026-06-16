import React, { useState } from 'react'
import '../components/css_folder/prescription._search.css'
import { motion } from 'framer-motion';
const Prescription_search = () => {

    const [patient_id, setPatientId] = useState();
    const [prescription, setPrescription] = useState([]);
    const [error, setError] = useState("");
    const handleSubmit= async ()=>{
        if(!patient_id) return ;

        try{
            const response = await fetch(`http://localhost:5000/prescription/${patient_id}`);

            if(!response.ok) throw new Error ("Patient Not Found... ");

            const prescription_data = await response.json()
            setPrescription(prescription_data);
            setError("");
            
        }
        catch(err){
            setPrescription([]);
            setError("Patient Not Found... ")
        }
        setPatientId("");


    }

  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div className='Prescription_search_main'>
              <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Login Page</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='Prescription_search_container'>
        <h1>Search Prescription...</h1>
        <br></br>
        <div className='Prescription_search_input'>
        <input
        name='patient_id'
        value={patient_id}
        onChange={(e)=>setPatientId(e.target.value)}
        placeholder='   Enter Patient ID ...'>
        </input>
        <button onClick={handleSubmit}>Search</button>
      </div>
      {error && <p>{error}</p>}
      {prescription.length > 0 && (
  <table className="prescription_search_table">
    <thead>
      <tr>
        <th>Prescription ID</th>
        <th>Patient ID</th>
        <th>Medicine</th>
      </tr>
    </thead>
    <tbody>
      {prescription.map((item) => (
        <tr key={item.pres_id}>
          <td>{item.pres_id}</td>
          <td>{item.patient_id}</td>
          <td>{item.medicine_name}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
        </div>
    </div>
    </motion.div>
  )
}

export default Prescription_search
