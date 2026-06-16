import React from 'react'
import { useState,useEffect } from "react";
const Admin_view_lab = () => {
const [labData, setLabData] = useState([]);

  useEffect(()=>{
    const fetchData = async()=>{
      try{
      const res = await fetch(`http://localhost:5000/admin-view-lab`)
      const data = await res.json()
      setLabData(data)
      }catch(err){
        console.log(err)
      }
    }
    fetchData();
  },[])

  return (
    <div className='admin-doc-add-container'>
       <div className='login_page_header norole_header prescription_search_header admin_login_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Admin Page</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div>
        <div className='all-patients' style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>All Lab Technicians</h1>
      {labData.length === 0 ? (
        <p>No lab technicians found...</p>
      ) : (
        <table style={{ width: '70%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px', color:'black' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' , color:'black' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', color:'black' }}>Assigned Patients</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' , color:'black' }}>Department</th>
            </tr>
          </thead>
          <tbody>
            {labData.map((lab) => (
              <tr key={lab.lab_tech_id }>
                <td style={{ border: '1px solid #ddd', padding: '8px' , color:'#ddd'}}>{lab.lab_tech_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', color:'#ddd' }}>{lab.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', color:'#ddd' }}>{lab.department}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', color:'#ddd' }}>{lab.assigned_patients}</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
      </div>
    </div>
  )
}

export default Admin_view_lab
