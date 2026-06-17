import { React, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../components/css_folder/login_page.css'

const Login_Page = () => {

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("no_role");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 basic validation
    if (!id || !password || role === "no_role") {
      alert("Please fill all fields and select a role 😤");
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
          role
        })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ login success
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.user_id);
        navigate(`/${role}`);
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

      <div className='login_page_main'>

        <div className='login_page_header norole_header prescription_search_header'>
          <img src='https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h1>|</h1>
          <h1>Login Page</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
        </div>

        <h3>Login Page</h3>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <div style={{ padding: '8px 16px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '8px', fontSize: '13px', textAlign: 'center', border: '1px solid #bae6fd', fontWeight: 'bold' }}>
            💡 Demo Logins: Use dummy_doc, dummy_lab, dummy_med, or dummy_front (password is same as ID)
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className='login_input'>

            <input
              type='text'
              placeholder='    Enter ID (e.g. dummy_doc, dummy_lab...)'
              value={id}
              onChange={(e) => setId(e.target.value)}
            />

            <input
              type='password'
              placeholder='    Enter Password (same as ID)'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type='submit'>Login</button>

            <NavLink to='/admin-login'>Admin? Click Here</NavLink>

          </form>
        </div>

        <h3>Select Role : </h3>

        <div className='home_cards'>

          <div className='login_page'>
            Doctors
            <img
              onClick={() => setRole("doctor_view")}
              src='https://i.pinimg.com/1200x/7d/97/cc/7d97cc3145669d38e8df8a309fd02cc1.jpg'
            />
          </div>

          <div className='login_page'>
            Lab Tech
            <img
              onClick={() => setRole("lab_view")}
              src="https://i.pinimg.com/1200x/ae/79/02/ae7902481d40839a3c6455d91b32eca4.jpg"
            />
          </div>

          <div className='login_page'>
            Front Desk
            <img
              onClick={() => setRole("front_desk_view")}
              src='https://i.pinimg.com/1200x/1d/ea/0a/1dea0aef540fec8515ea926d19492828.jpg'
            />
          </div>

          <div className='login_page'>
            Pharmasits
            <img
              onClick={() => setRole("medicine_view")}
              src='https://i.pinimg.com/736x/5a/bb/44/5abb44c7ffa9f7ca56076cd75d990657.jpg'
            />
          </div>

        </div>

      </div>

    </motion.div>
  )
}

export default Login_Page