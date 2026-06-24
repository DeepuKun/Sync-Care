// import React,{useEffect, useState} from 'react'
// import { useParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import '../components/css_folder/lab.css'

// const Lab = () => {
//   const [patients, setPatients] = useState([]);
//   const {id} = useParams();

// // NEW STATES
//   const [patientId, setPatientId] = useState("");
//   const [file, setFile] = useState(null);

//   useEffect(()=>{
//     const fetchPatients= async()=>{
//       const response = await fetch(`http://localhost:5000/assigned-patients/${id}`)
//       const data = await response.json();
//       setPatients(data);
//     }
//     fetchPatients();
//   },[])

// // UPLOAD FUNCTION
//   const handleUpload = async () => {
//     if (!file || !patientId ) {
// alert("Fill everything bro");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("patient_id", patientId);
//     formData.append("file_name", file.name);
//     formData.append("pdf", file);

//     try {
//       const res = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData
//       });

//       const data = await res.text();
//       alert(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
// <motion.div
//   initial={{ opacity: 0 }}
//   animate={{ opacity: 1 }}
//   exit={{ opacity: 0 }}
//   transition={{ duration: 0.3 }}
// >
//     <div className='lab-container'>
//        <div className='login_page_header norole_header prescription_search_header'>
//           <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
//           <h1>Ever<span className='light'>light</span> Hospital</h1>
//           <h3>powered by <span className='synccare'>SyncCare</span></h3>
//           <h1>|</h1>
//           <h1>Lab Test Page</h1>
//           <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
//       </div>

//       <div className=''>
        
//         <table className="assigned-patient-table">
//   <thead>
//     <tr>
//       <th>Patient ID</th>
//       <th>Patient Name</th>
//       <th>Status</th>
//       <th>Test Type</th>
//       <th>Sub Type</th>
//       <th>Status</th>
//     </tr>
//   </thead>

//   <tbody>
//     {patients.map((patient, index) => (
//       <tr key={index} onClick={() => setPatientId(patient.patient_id)}>
//         <td>{patient.patient_id}</td>
//         <td>{patient.patient_name}</td>
//         <td>{patient.test_status}</td>
//         <td>{patient.test_type}</td>
//         <td>{patient.sub_type}</td>
//         <td>
//           <button>Ready</button>
//           <button>Done</button>
//         </td>
//       </tr>
//     ))}
//   </tbody>

// </table>  
//       </div>

//       <div className='Test_Result_form'>
//         <input 
//           placeholder='   Enter ID : '
//           value={patientId}
//           onChange={(e)=>setPatientId(e.target.value)}
//         />

//         <input 
//           type='file'
//           accept='application/pdf'
//           onChange={(e)=>setFile(e.target.files[0])}
//         />

//         <button onClick={handleUpload}>Upload</button>
//       </div>

//     </div>
// </motion.div>
//   )
// }

// export default Lab
import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../components/css_folder/lab.css'

const Lab = () => {
  const [patients, setPatients] = useState([]);
  const id = localStorage.getItem("userId");

  // STATES
  const [patientId, setPatientId] = useState("");
  const [file, setFile] = useState(null);

  useEffect(()=>{
    const fetchPatients= async()=>{
      const response = await fetch(`http://localhost:5000/assigned-patients/${id}`)
      const data = await response.json();
      setPatients(data);
    }
    fetchPatients();
  },[])

  // UPLOAD FUNCTION
  const handleUpload = async () => {
    if (!file || !patientId ) {
      alert("Fill everything bro");
      return;
    }

    const formData = new FormData();
    formData.append("patient_id", patientId);
    formData.append("file_name", file.name);
    formData.append("pdf", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.text();
      alert(data);
    } catch (err) {
      console.error(err);
    }
  };

  // NEW FUNCTION (status update)
  const updateStatus = async (patient_id, status) => {
    try {
      const res = await fetch("http://localhost:5000/update-test-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ patient_id, status })
      });

      const data = await res.text();
      alert(data);

      // refresh
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div className='lab-container'>
       <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Lab Test Page</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>

      <div className=''>
        
        <table className="assigned-patient-table">
  <thead>
    <tr>
      <th>Patient ID</th>
      <th>Patient Name</th>
      <th>Status</th>
      <th>Test Type</th>
      <th>Sub Type</th>
      <th>Status</th>
    </tr>
  </thead>

  <tbody>
    {patients.map((patient, index) => (
      <tr key={index} onClick={() => setPatientId(patient.patient_id)}>
        <td>{patient.patient_id}</td>
        <td>{patient.patient_name}</td>
        <td>{patient.test_status}</td>
        <td>{patient.test_type}</td>
        <td>{patient.sub_type}</td>
        <td>
          <button 
            onClick={(e)=>{
              e.stopPropagation();
              updateStatus(patient.patient_id, "Ready");
            }}
          >
            Ready
          </button>

          <button 
            onClick={(e)=>{
              e.stopPropagation();
              updateStatus(patient.patient_id, "Done");
            }}
          >
            Done
          </button>
        </td>
      </tr>
    ))}
  </tbody>

</table>  
      </div>

      <div className='Test_Result_form'>
        <input 
          placeholder='   Enter ID : '
          value={patientId}
          onChange={(e)=>setPatientId(e.target.value)}
        />

        <input 
          type='file'
          accept='application/pdf'
          onChange={(e)=>setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>Upload</button>
      </div>

    </div>
</motion.div>
  )
}

export default Lab