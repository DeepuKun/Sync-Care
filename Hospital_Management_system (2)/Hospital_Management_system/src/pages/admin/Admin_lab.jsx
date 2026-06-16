import React from 'react'
import '../../components/css_folder/admin-doc.css'
import { NavLink } from 'react-router-dom'
const Admin_lab = () => {
  return (
    <div className='Admin-med-container'>
      <div className='login_page_header norole_header prescription_search_header admin_login_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Edit Lab Team Details</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='admin-doc-hero'>
        <div className='admin-doc-options'>
          <div className='admin-doc-option-buttons'>
            <img src='https://i.pinimg.com/originals/7c/e9/e3/7ce9e34927261d3b035090cac779fec5.gif'></img>
            <NavLink to={'/admin-add-lab'}><button>Add</button></NavLink>
          </div>
          <div className='admin-doc-option-buttons'>
            <img src='https://i.pinimg.com/originals/7e/b0/1e/7eb01e25adeeda7febfcd735a804f59d.gif'></img>
            <NavLink to={"/admin-remove-lab"}><button>Remove</button></NavLink>
          </div>
        </div>
        <div className='admin-doc-options'>
          <div className='admin-doc-option-buttons'>
            <img src='https://i.pinimg.com/originals/d9/c6/6e/d9c66e7d0d7da94f591bc7850b3afdbb.gif'></img>
            <NavLink to={'/admin-view-lab'}><button>View</button></NavLink>
          </div>
          <div className='admin-doc-option-buttons'>
            <img src='https://i.pinimg.com/originals/13/fa/be/13fabe368d08211706da14d461727b50.gif'></img>
            <NavLink to={'/admin-uppdate-lab'}><button>Update</button></NavLink>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Admin_lab
