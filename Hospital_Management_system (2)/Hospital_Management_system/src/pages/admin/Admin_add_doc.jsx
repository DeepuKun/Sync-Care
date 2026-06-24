// import React from 'react'
// import '../../components/css_folder/admin-doc.css'

// const Admin_add_doc = () => {
//   return (
//     <div className='admin-doc-add-container'>
//        <div className='login_page_header norole_header prescription_search_header admin_login_header'>
//           <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
//           <h1>Ever<span className='light'>light</span> Hospital</h1>
//           <h3>powered by <span className='synccare'>SyncCare</span></h3>
//           <h1>|</h1>
//           <h1>Admin Page</h1>
//           <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
//       </div>
//       <div>

//         <form className='add-doc-form'> 
//           <input placeholder='   Enter Name...'></input>
//           <input placeholder='   Enter Aadhar Card Number...'></input>
//           <input placeholder='   Enter Specialization...'></input>
//           <button type='submit'>Add</button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Admin_add_doc
import React, { useState } from 'react'
import '../../components/css_folder/admin-doc.css'

const Admin_add_doc = () => {

  const [docId, setDocId] = useState('');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/add-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doc_id: docId,
          doc_name: name,
          specialization,
          password
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Doctor Added Successfully');
        setDocId('');
        setName('');
        setSpecialization('');
        setPassword('');
      } else {
        alert(data || 'Error adding doctor');
      }

    } catch (err) {
      console.error(err);
      alert('Server error bro');
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
            placeholder='   Enter Doctor ID...'
            value={docId}
            onChange={(e) => setDocId(e.target.value)}
            required
          />

          <input 
            placeholder='   Enter Name...'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input 
            placeholder='   Enter Specialization...'
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />

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

export default Admin_add_doc  