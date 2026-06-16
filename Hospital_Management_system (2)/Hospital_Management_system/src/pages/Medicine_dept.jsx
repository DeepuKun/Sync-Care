import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../components/css_folder/med.css'
import MedicineList from '../components/MedicineList'
import { motion } from 'framer-motion';
const Medicine_dept = () => {
  return(
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div className='med_dept'>
             <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Medicine Page</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='med_dashboard_buttons'>
        <NavLink to={'/all-medicines'} >
        <button className='med_add_button'><img className='med_add_logo' src='https://i.pinimg.com/736x/72/62/8f/72628f4f5634992e46d15c2474082b35.jpg'></img> Add Medicine</button>
       </NavLink>
       <NavLink to={'/search-medicine'}>
        <button className='med_add_button'><img className='med_add_logo' src='https://i.pinimg.com/736x/79/ce/10/79ce10e4c34077215b988139aec41dbe.jpg'></img>Search Medicines</button>
       </NavLink>
       <NavLink to={'/lowest-medicines'}>
       <button className='med_add_button'><img className='med_add_logo' src='https://i.pinimg.com/736x/f9/6c/77/f96c77a2983490f331561c36c546093c.jpg'></img>Lowest Medicines</button>
       </NavLink>
       <NavLink to={'/search-prescription'}>
        <button className='med_add_button'><img className='med_add_logo' src='https://i.pinimg.com/736x/97/3d/24/973d240520815d9d12c2bb95a08a926c.jpg'></img>Search Prescriptions</button>
       </NavLink>
      </div>
      <MedicineList/>
    </div>
    </motion.div>
  )
}

export default Medicine_dept
