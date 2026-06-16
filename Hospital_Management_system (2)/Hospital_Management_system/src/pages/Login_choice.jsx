import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion';
const Login_choice = () => {

  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div className='login_choice'>
      <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Login Page</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div>

        <div className='login_choice_buttons'>
                  <div className='login_choice_left'>
         <h3>Welcome to <span className='synccare'>SyncCare</span>, </h3>
         <h5>the official web-portal for...</h5>
         <h1>Ever<span className='light'>light</span> Hospital</h1>
         <p>✔ 24/7 Emergency  
✔ Expert Doctors  
✔ Digital Prescriptions  
✔ Easy Access
</p>
         <br></br>
         <h4>Please select your login type to continue.</h4>
        </div>
        <div className='login_choice_right'>
            <div className='login_choice_option' style={{ height: 'auto', paddingBottom: '15px' }}>
              <img className='login_choice_img' src='https://i.pinimg.com/originals/80/40/6b/80406beecc6b45d9392124e6adcca95f.gif'></img>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', width: '100%', padding: '10px 10px 0' }}>
                <NavLink to={'/User_login'}><button style={{ width: '120px', margin: '0', borderRadius: '10px', height: '38px', fontSize: '13px' }}>Login</button></NavLink>
                <NavLink to={'/User_register'}><button style={{ width: '120px', margin: '0', borderRadius: '10px', height: '38px', fontSize: '13px', backgroundColor: '#10B981' }}>Register</button></NavLink>
              </div>
            </div>

            <div className='login_choice_option' style={{ height: 'auto', paddingBottom: '15px' }}>
              <img className='login_choice_img' src='https://i.pinimg.com/originals/54/af/fe/54affec9687c83ebe4ab261f257ab4c1.gif'></img>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '10px 10px 0' }}>
                <NavLink to={'/login-page'}><button style={{ width: '250px', margin: '0', borderRadius: '10px', height: '38px', fontSize: '13px' }}>Login as Staff</button></NavLink>
              </div>
            </div>
            </div>
        </div>
      </div>
    </div>
    </motion.div>
  )
}

export default Login_choice
