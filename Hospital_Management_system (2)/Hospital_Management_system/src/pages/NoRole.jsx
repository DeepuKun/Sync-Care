import React from 'react'
import '../components/css_folder/norole.css'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion';
const NoRole = () => {
  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div>
      <div className='norole'>
      <div className='login_page_header norole_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='norole_notice'>
        <h3> Please Select a Role to see details...</h3>
        <br></br>
        <NavLink to={'/login-page'}> <button> Go Back </button></NavLink>
        
      </div>
      </div>
    </div>
    </motion.div>
  )
}

export default NoRole
