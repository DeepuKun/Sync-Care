import React, { useState } from 'react'

const Admin_add_front = () => {

  const [name, setName] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/add-front-desk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          front_desk_id: aadhar,
          password,
          role: "front_desk_view"
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Front Desk Added Successfully 👩‍💼🔥');
        setName('');
        setAadhar('');
        setPassword('');
      } else {
        alert(data || 'Error adding front desk 💀');
      }

    } catch (err) {
      console.error(err);
      alert('Server error bro 😭');
    }
  };

  return (
    <div className='admin-front-edit-container'>
      
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
            placeholder='   Enter Name...'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input 
            placeholder='   Enter Aadhar Card Number...'
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
            required
          />

          {/* 🔥 PASSWORD FIX */}
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

export default Admin_add_front