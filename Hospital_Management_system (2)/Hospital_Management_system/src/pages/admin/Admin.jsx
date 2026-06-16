import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/Login_choice');
  };

  return (
    <div className='admin-container'>
      <div className='login_page_header norole_header prescription_search_header admin_login_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Admin Page</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='admin-hero'>
        <div className='admin-left'>
          <div className='admin-left-options'>
            <div className='admin-option'>
              <img src='https://i.pinimg.com/originals/51/d7/e7/51d7e77c36a68ee327dcb68337222b1e.gif'></img>
              <NavLink to='/admin-doc'><button>Doctors</button></NavLink>
            </div>
            <div className='admin-option'>
              <img src='https://i.pinimg.com/originals/e7/c0/e6/e7c0e6f332420815634434b473247622.gif'></img>
              <NavLink to='/admin-med'><button>Medincine Dept</button></NavLink>
              </div>
          </div>
          <div className='admin-left-options'>
            <div className='admin-option'>
              <img src='https://i.pinimg.com/originals/b1/b6/d3/b1b6d3339eb2f01930edaa8f1a068108.gif'></img>
              <NavLink to='/admin-front-desk'><button>Front Desk</button></NavLink>
            </div>
            <div className='admin-option'>
              <img src='https://i.pinimg.com/originals/e0/b3/be/e0b3be337cc6f21e7a4c7f9ab3291c58.gif'></img>
              <NavLink to='/admin-lab'><button>Lab Team</button></NavLink>
            </div>
          </div>
        </div>
        <div className='admin-right'>
          <div className='admin-right-upper'>
            <img className='chat' src='https://i.pinimg.com/originals/de/d0/bb/ded0bbdd8485e424327257405a86a884.gif'></img>
          </div>
          <div className='admin-right-lower'>
            <button onClick={handleLogout}>Log Out</button>
            <button>Extra </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
