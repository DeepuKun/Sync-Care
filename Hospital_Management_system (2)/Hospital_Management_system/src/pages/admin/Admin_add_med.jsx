import React, { useState } from 'react'
import '../../components/css_folder/admin-med.css'

const Admin_add_med = () => {

  const [medId, setMedId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/add-med-dept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          med_dept_id: medId,
          name,
          password,
          role: "medicine_view"
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Medicine Dept Added 💊🔥');
        setMedId('');
        setName('');
        setPassword('');
      } else {
        alert(data || 'Error 💀');
      }

    } catch (err) {
      console.error(err);
      alert('Server error 😭');
    }
  };

  return (
    <div className='admin-remove-container'>
      
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
            placeholder='   Enter ID...'
            value={medId}
            onChange={(e) => setMedId(e.target.value)}
            required
          />

          <input 
            placeholder='   Enter Name...'
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default Admin_add_med