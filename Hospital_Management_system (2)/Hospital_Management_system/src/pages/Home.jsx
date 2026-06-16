import React from 'react'
import '../components/css_folder/home.css'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion';
import Doc_view from './Doc_view'
import Login_Page from './Login_Page'
const Home = () => {
  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div className='home_container'>
        {/* Login Area */}
        <div className="hero_section">
          <div  className='Welcome_Heading'>
            <h2>Welcome to <span className='synccare'>SyncCare</span> for </h2>
            <div className='name'>
              <h1>Ever<span className='light'>light</span> Hospital</h1><img className='home_page_logo' src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
            </div>
            <h5>Smart. Secure. Seamless.
              <h3>Your Health, Our Mission</h3>
              <br></br>
Empowering healthcare with intelligent digital solutions.</h5>
            <NavLink to={'/Login_choice'}><button>Login</button></NavLink>
          </div>
        </div>
        <div className='hero-right'>
          {/*<img className='hero-right_img' src='https://i.pinimg.com/736x/56/86/91/568691dff91597e5a16a53acb3b714dd.jpg' ></img> src="https://i.pinimg.com/736x/44/67/e5/4467e5cbe0688780bdd0c5f4e4eb2695.jpg"*/}
        </div>
    </div>
    </motion.div>
  )
}

export default Home
