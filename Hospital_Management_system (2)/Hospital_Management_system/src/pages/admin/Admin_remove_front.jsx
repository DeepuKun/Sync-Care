import React, { useState } from 'react'
import '../../components/css_folder/admin-front.css'

const Admin_remove_front = () => {

  const [frontId, setFrontId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!frontId) {
      alert("Enter Front Desk ID");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/delete-front-desk/${frontId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        alert("Front Desk Removed Successfully");
        setFrontId('');
      } else {
        alert(data || "Error deleting front desk");
      }

    } catch (err) {
      console.error(err);
      alert("Server error bro");
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
        <form className='admin-remove-doc' onSubmit={handleSubmit}>
          
          <input 
            placeholder='   Enter Front Desk ID to Remove...'
            value={frontId}
            onChange={(e) => setFrontId(e.target.value)}
            required
          />

          <button type='submit'>Remove Front Desk</button>

        </form>
      </div>
    </div>
  )
}

export default Admin_remove_front