import React, { useState } from 'react'
import '../components/css_folder/front_desk.css'
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
const Front_desk_view = () => {

  return(
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div className='front_desk_main'>
      <div className='doc_header front_desk_header'>
          <img className='doc_page_logo' src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h2>Ever<span className='light'>light</span> Hospital</h2>
          <h2>|</h2>
          <h2>Front Desk </h2>
          <input placeholder='   Seacrh Patient...'></input>
          <img className='front_desk_profile_icon' src='https://i.pinimg.com/736x/23/d1/3a/23d13a1dbad6a60319413ec2512aed29.jpg'></img>
        </div>
        <div className='front_desk_hero_container' >

          <div className='front_desk_hero'>

          <div className='front_desk_division'>
            <h2>Patients : </h2>
            <NavLink to='/add-patient'>
            <button>Add Patients</button>
          </NavLink>
          <NavLink to={'/ready-patients'}> <button>Ready Queue</button></NavLink>
             <NavLink to={'/every-patients'}><button>All Patients</button></NavLink>
          </div>

          <div className='front_desk_division'>
            <h2>Doctors : </h2>
             <NavLink to={'/every-doctors'}><button>All Doctors</button></NavLink>
            <NavLink to={'/search-doctors'}><button>Search Doctors</button></NavLink>
            <button>Contact Doctors</button>
          </div>
          <div className='front_desk_division'>
            <h2>Lab Test : </h2>
            <NavLink to={'/front-lab-page'}><button>Waiting Patients</button></NavLink> 
            <NavLink to={"/lab-ready-queue"}><button>Ready Queue</button></NavLink>
            <NavLink to={'/all-lab-test'}><button>All Lab Test</button></NavLink>
          </div>
        </div>
        <div className='front_desk_chat'>
           <img style={{height:'65vh', width:'57vw', borderRadius:'10px'}} src='https://i.pinimg.com/originals/e3/1b/75/e31b752875679b64fce009922f9f0dda.gif'></img>
          </div>
        </div>
        <div className='front_desk_footer'>
          <div className='front_desk_footer_left'>
            <p>No. of beds available : 20</p>
            <p>Other Hospitals Contact Info : 9090123232, 849834980</p>
          </div>
          <div className='front_desk_footer_right'>
            <button>EMERGENCY!</button>
          </div>
        </div>
        
    </div>
    </motion.div>
  );
}

export default Front_desk_view
