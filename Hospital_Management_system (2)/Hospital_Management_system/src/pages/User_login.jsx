import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'

const User_login = () => {

  let [id, setId] = useState('');
  let [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id || !password) {
      alert("Fill all fields 😤");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          password,
          role: "user" // 🔥 IMPORTANT
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.user_id);
        navigate(`/user`);
      } else {
        alert(data.message || "Login failed 😭");
      }

    } catch (err) {
      console.error(err);
      alert("Server error 😭");
    }
  };

  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>

    <div className='user_login_container'>

      <div className='login_page_header norole_header prescription_search_header'>
        <img src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
        <h1>Ever<span className='light'>light</span> Hospital</h1>
        <h3>powered by <span className='synccare'>SyncCare</span></h3>
        <h1>|</h1>
        <h1>User Login</h1>
        <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>

      <div className='user_login_hero'>

        <div className='user_login_left'>
          <h1>Hey User,</h1>
          <br></br>
          <br></br>
          <h3>Welcome to Ever<span className='light'>light</span> Hospital</h3>
          <p>Please enter your credentials to log in.</p>
        </div>

        <form className='user_login_right' onSubmit={handleSubmit}>

          <img src='https://i.pinimg.com/originals/9f/c2/12/9fc2126eec2c0a3876e3f2097af9b983.gif'></img>

          <input
            value={id}
            onChange={(e)=>setId(e.target.value)}
            name='id'
            type='text'
            placeholder='   Enter Aadhar Card Number...'
          />

          <input
            type='password'
            placeholder='  Password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '10px', width: '25vw', marginTop: '10px' }}>
            <button type='submit' style={{ flex: 1, height: '5vh', borderRadius: '10px', margin: '0', cursor: 'pointer' }}>Login</button>
            <button type='button' style={{ flex: 1, height: '5vh', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', margin: '0' }} onClick={() => navigate('/User_register')}>Register</button>
          </div>

        </form>

      </div>

    </div>

</motion.div>
  )
}

export default User_login