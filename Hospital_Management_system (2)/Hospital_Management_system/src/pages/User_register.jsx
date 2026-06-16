import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const User_register = () => {
  const [patientId, setPatientId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId || !password || !confirmPassword) {
      alert("Please fill all fields 😤");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long 🔒");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patient_id: patientId,
          password
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! 🎉 Please login.");
        navigate('/User_login');
      } else {
        alert(data.error || "Registration failed 😭");
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
          <img src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg' alt="logo" />
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>User Registration</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg' alt="decor" />
        </div>

        <div className='user_login_hero' style={{ height: '85.5vh', padding: '60px' }}>
          <div className='user_login_left'>
            <h1>New User Registration,</h1>
            <br />
            <br />
            <h3>Create your account at Ever<span className='light'>light</span> Hospital</h3>
            <p>Please enter your Aadhar Card Number and set a secure password to register.</p>
          </div>

          <form className='user_login_right' onSubmit={handleSubmit}>
            <img src='https://i.pinimg.com/originals/9f/c2/12/9fc2126eec2c0a3876e3f2097af9b983.gif' alt="decor gif" />

            <input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              type='text'
              placeholder='   Enter Aadhar Card Number...'
            />

            <input
              type='password'
              placeholder='  Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type='password'
              placeholder='  Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '10px', width: '25vw', marginTop: '10px' }}>
              <button type='submit' style={{ flex: 1, height: '5vh', borderRadius: '10px', margin: '0', cursor: 'pointer' }}>Register</button>
              <button type='button' style={{ flex: 1, height: '5vh', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', margin: '0' }} onClick={() => navigate('/User_login')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default User_register;
