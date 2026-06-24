// import React,{useState, useEffect} from 'react'
// import '../components/css_folder/user.css'
// import { NavLink, useParams } from 'react-router-dom'
// import { motion } from 'framer-motion';
// const User = () => {
//   let id = useParams().id;
//   const [userData, setUserData] = useState([]);
//   useEffect(() => {
//   fetch(`http://localhost:5000/user/${id}`)
//     .then((res) => res.json())
//     .then((data) => setUserData(data))
//     .catch((err) => console.log(err));
// }, [id]);
  
//   return (
// <motion.div
//   initial={{ opacity: 0 }}
//   animate={{ opacity: 1 }}
//   exit={{ opacity: 0 }}
//   transition={{ duration: 0.3 }}
// >
//     <div>
//        <div className='login_page_header norole_header prescription_search_header'>
//           <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
//           <h1>Ever<span className='light'>light</span> Hospital</h1>
//           <h3>powered by <span className='synccare'>SyncCare</span></h3>
//           <h1>|</h1>
//           <h1>User Page</h1>
//           <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
//       </div>
//       <div className='user_prescription_section'>
//         <div className='user_header'>
//           <h1> Hi User, have a <span> Healthy</span> Day...</h1>
//           <div className='user_header_choices'>
//                     <div className='user_header_button'>
//                       <img src='https://i.pinimg.com/originals/91/f1/de/91f1dec1568f2a70e1b724e77be47388.gif'></img>
//                       <button>Chat with Us</button>
//                     </div >
//                     <div className='user_header_button'>
//                       <img src='https://i.pinimg.com/originals/ce/55/8b/ce558b14c996afa63c6f7c97f8c6598f.gif'></img>
//                      <NavLink to={'/Login_choice'}> <button >Log Out</button></NavLink>
//                     </div>
//           </div>
//         </div>
//         <div> 
//         <div className='user_prescription'>
//           <h2>Here are your prescriptions :</h2>
//           {userData.map(pres => (
//             <div className='user_prescription_card' key={pres.pres_id}>
//               <h3>Medicine Name: {pres.medicine_name}</h3>
//               <h3>Morning Dose: {pres.morning}</h3>
//               <h3>Noon Dose: {pres.noon}</h3>
//               <h3>Evening Dose: {pres.evening}</h3>
//               <h3>Night Dose: {pres.night}</h3>
//             </div>
//           ))}
          
//         </div>
//         <div className='User_results_container'>
//           <h3>Expected Lab Test Results Date :  </h3>
//         </div>
//         </div>


        
//       </div>
//     </div>
//     </motion.div>
//   )
// }

// export default User

import React,{useState, useEffect} from 'react'
import '../components/css_folder/user.css'
import { NavLink, useParams } from 'react-router-dom'
import { motion } from 'framer-motion';

const User = () => {
  const id = localStorage.getItem("userId");

  const [userData, setUserData] = useState([]);
  const [results, setResults] = useState([]);
  const [patientDetails, setPatientDetails] = useState({});

  // PASSWORD STATES
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {

    fetch(`http://localhost:5000/user/${id}`)
      .then(res => res.json())
      .then(data => setUserData(data));

    fetch(`http://localhost:5000/results/${id}`)
      .then(res => res.json())
      .then(data => setResults(data));

    fetch(`http://localhost:5000/patient/${id}`)
      .then(res => res.json())
      .then(data => setPatientDetails(data));

    // FETCH CURRENT PASSWORD
    fetch(`http://localhost:5000/user-password/${id}`)
      .then(res => res.json())
      .then(data => setCurrentPassword(data.password));

  }, [id]);

  const handlePasswordUpdate = () => {
    fetch(`http://localhost:5000/update-password/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password: newPassword })
    })
    .then(res => res.json())
    .then(() => {
      alert("Password Updated");
      setCurrentPassword(newPassword); // update UI instantly
      setNewPassword("");
    });
  }

  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
<div className="user_main_layout">

  {/* SIDEBAR */}
  <div className={`user_sidebar ${showSidebar ? "active" : ""}`}>
    <h2>Patient Info</h2>

    <p><b>Name:</b> {patientDetails.patient_name}</p>
    <p><b>Address:</b> {patientDetails.address}</p>
    <p><b>Doctor ID:</b> {patientDetails.doc_assigned}</p>
    <p><b>Specialization:</b> {patientDetails.specialization}</p>
    <p><b>Status:</b> {patientDetails.status}</p>
    <p><b>Test Status:</b> {patientDetails.test_status}</p>
    <p><b>Lab Tech:</b> {patientDetails.lab_tech_assigned}</p>
    <p><b>Result Date:</b> {patientDetails.result_date}</p>

    <hr />

    {/* CURRENT PASSWORD DISPLAY */}
    <h3>Current Password</h3>
    <p className="current_password">
  {patientDetails.password}
</p>

    <h3>Change Password</h3>
    <input 
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e)=>setNewPassword(e.target.value)}
    />

    <button onClick={handlePasswordUpdate}>
      Update Password
    </button>
  </div>

  {/* OVERLAY */}
  {showSidebar && (
    <div className="overlay" onClick={() => setShowSidebar(false)}></div>
  )}

  {/* MAIN CONTENT */}
  <div className="user_content">

    <div className='login_page_header norole_header prescription_search_header'>
      <img src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
      <h1>Ever<span className='light'>light</span> Hospital</h1>
      <h3>powered by <span className='synccare'>SyncCare</span></h3>
      <h1>|</h1>
      <h1>User Page</h1>
      <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
    </div>

    <div className='user_prescription_section'>
      <div className='user_header'>
        <h1> Hi User, have a <span> Healthy</span> Day...</h1>

        <div className='user_header_choices'>

          <div className='user_header_button'>
            <img src='https://i.pinimg.com/originals/91/f1/de/91f1dec1568f2a70e1b724e77be47388.gif'></img>
            <button onClick={() => setShowSidebar(true)}>
              User Info
            </button>
          </div>

          <div className='user_header_button'>
            <img src='https://i.pinimg.com/originals/ce/55/8b/ce558b14c996afa63c6f7c97f8c6598f.gif'></img>
            <NavLink to={'/Login_choice'} onClick={() => localStorage.clear()}>
              <button>Log Out</button>
            </NavLink>
          </div>

        </div>
      </div>

      <div> 
        <div className='user_prescription'>
          <h2>Here are your prescriptions :</h2>
          {userData.map(pres => (
            <div className='user_prescription_card' key={pres.pres_id}>
              <h3>Medicine Name: {pres.medicine_name}</h3>
              <h3>Morning Dose: {pres.morning}</h3>
              <h3>Noon Dose: {pres.noon}</h3>
              <h3>Evening Dose: {pres.evening}</h3>
              <h3>Night Dose: {pres.night}</h3>
            </div>
          ))}
        </div>

        <div className='User_results_container'>
          <h3>Your Lab Test Results:</h3>

          {results.length === 0 ? (
            <p>No results yet</p>
          ) : (
            results.map((res) => (
              <div key={res.result_id}>
                <p>{res.file_name} ({res.date})</p>
                <a href={`http://localhost:5000/download/${res.result_id}?token=${localStorage.getItem("token")}`}>
                  Download Report
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

  </div>
</div>
</motion.div>
  )
}

export default User