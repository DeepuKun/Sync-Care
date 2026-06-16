import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../components/css_folder/lab.css'
const All_Lab_Test = () => {
    const [data, setData] = useState([]);

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const response = await fetch('http://localhost:5000/all-lab-test')
                const data = await response.json();
                setData(data);
                
            }catch(err){
                console.log(err);
            }
        }
        fetchData();
    },[])
  return (
    <div className='all-lab-test-container'>
      <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>All Patients</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='all-lab-test'>
        {
            <table border="1">
  <thead>
    <tr>
      <th>Patient ID</th>
      <th>Test Type</th>
      <th>Sub Type</th>
    </tr>
  </thead>
  <tbody>
    {data.map((patient) => (
      <tr key={patient.test_id}>
        <td>{patient.patient_id}</td>
        <td>{patient.test_type}</td>
        <td>{patient.sub_type}</td>
      </tr>
    ))}
  </tbody>
</table>
        }
      </div>
    </div>
  )
}

export default All_Lab_Test
