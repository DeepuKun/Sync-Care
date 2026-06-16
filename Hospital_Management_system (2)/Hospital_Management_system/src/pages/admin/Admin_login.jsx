import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../components/css_folder/admin.css'

const Admin_login = () => {

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

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
          role: "admin" // 🔥 FIXED ROLE
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.user_id);
        navigate(`/admin`); // 🔥 go to admin dashboard
      } else {
        alert(data.message || "Login failed 😭");
      }

    } catch (err) {
      console.error(err);
      alert("Server error 😭");
    }
  };

  return (
    <div className='admin_login_container'>

      <div className='login_page_header norole_header prescription_search_header admin_login_header'>
        <img src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
        <h1>Ever<span className='light'>light</span> Hospital</h1>
        <h3>powered by <span className='synccare'>SyncCare</span></h3>
        <h1>|</h1>
        <h1>Admin Login</h1>
        <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>

      <div>
        <div className='admin_login'>

          <img src='https://i.pinimg.com/originals/81/17/8b/81178b47a8598f0c81c4799f2cdd4057.gif'></img>

          <form onSubmit={handleSubmit}>

            <input
              placeholder='   Enter ID...'
              value={id}
              onChange={(e)=>setId(e.target.value)}
            />

            <input
              type='password'
              placeholder='   Enter Password...'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button type='submit'>Login</button>

          </form>

        </div>
      </div>

    </div>
  )
}

export default Admin_login   