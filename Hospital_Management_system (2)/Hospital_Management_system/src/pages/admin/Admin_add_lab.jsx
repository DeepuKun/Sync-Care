// import React from 'react'

// const Admin_add_lab = () => {
//   return (
//     <div>
//        <div className='login_page_header norole_header prescription_search_header admin_login_header'>
//           <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
//           <h1>Ever<span className='light'>light</span> Hospital</h1>
//           <h3>powered by <span className='synccare'>SyncCare</span></h3>
//           <h1>|</h1>
//           <h1>Admin Page</h1>
//           <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
//       </div>
//     </div>
//   )
// }

// export default Admin_add_lab

import React, { useState } from 'react'
import '../../components/css_folder/admin-doc.css'

const Admin_add_lab = () => {

  const [labTechId, setLabTechId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/add-lab-tech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lab_tech_id: labTechId,
          name,
          department,
          password,
          role: "lab_view"
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Lab Tech Added Successfully 🧪🔥');
        setLabTechId('');
        setName('');
        setDepartment('');
        setPassword('');
      } else {
        alert(data || 'Error adding lab tech 💀');
      }

    } catch (err) {
      console.error(err);
      alert('Server error bro 😭');
    }
  };

  return (
    <div className='admin-doc-add-container'>
      
      <div className='login_page_header norole_header prescription_search_header admin_login_header'>
        <img src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg' />
        <h1>Ever<span className='light'>light</span> Hospital</h1>
        <h3>powered by <span className='synccare'>SyncCare</span></h3>
        <h1>|</h1>
        <h1>Admin Page</h1>
        <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg' />
      </div>

      <div>
        <form className='add-doc-form' onSubmit={handleSubmit}> 
          
          <input 
            placeholder='   Enter Lab Tech ID...'
            value={labTechId}
            onChange={(e) => setLabTechId(e.target.value)}
            required
          />

          <input 
            placeholder='   Enter Name...'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* ✅ DROPDOWN FIX (NO TYPING ERRORS ANYMORE) */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">Select Department 🧪</option>
            <option value="Hematology">Hematology</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Immunology">Immunology</option>
            <option value="Endocrinology">Endocrinology</option>
            <option value="Histopathology">Histopathology</option>
            <option value="Radiology">Radiology</option>
            <option value="Pathology">Pathology</option>
            <option value="Biochemistry">Biochemistry</option>
          </select>

          <input 
            type="password"
            placeholder='   Enter Password...'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type='submit'>Add</button>

        </form>
      </div>
    </div>
  )
}

export default Admin_add_lab