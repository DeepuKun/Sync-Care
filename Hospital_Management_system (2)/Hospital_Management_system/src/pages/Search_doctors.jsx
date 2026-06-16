import { s } from 'framer-motion/client';
import React, {useState,useEffect} from 'react'

const Search_doctors = () => {

    let [specialization, setSpecialization] = useState('');
    let [doctors, setDoctors] = useState([]);

      useEffect(() => {
        fetch(`http://localhost:5000/doctors/${specialization}`)
          .then(res => res.json())
          .then(data => setDoctors(data))
          .catch(err => console.error(err));
      }, [specialization]);

  return (
    <div>
            <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Search Doctors</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='all-patient-container'>
        <div className='search_doctors_header'>
            <button onClick={()=>setSpecialization('Cardiology')}>Cardiologist</button>
            <button onClick={()=>setSpecialization('Neurology')}>Neurologist</button>
            <button onClick={()=>setSpecialization('Orthopedic')}>Orthopedic</button>
            <button onClick={()=>setSpecialization('Dermatologist')}>Dermatologist</button>
            <button onClick={()=>setSpecialization('Pediatrician')}>Pediatrician</button>
            <button onClick={()=>setSpecialization('Psychiatrist')}>Psychiatrist</button>
            <button onClick={()=>setSpecialization('ENT')}>ENT Specialist</button>
            <button onClick={()=>setSpecialization('Neurologist')}>Neurologist</button>
        </div>
        <div className='search_doctors_results'>
            <div className='searched_doctors'>

                {!specialization ? (
  <p>Please pick a specialization...</p>
) : !doctors.length ? (
  <p>No doctors found for {specialization}</p>
) : (
  <div className='doctors-list'>
    <h1>Doctors specializing in {specialization}:</h1>
    {
                    doctors.map((doctor)=>{
                        return(
                            <div className='Doctor-Card' key={doctor.doc_id}> 
                                <h2> Doctor's Name : {doctor.doc_name}</h2>
                                <h2> Doctor's ID : {doctor.doc_id}</h2>
                                <h3>Specialization : {doctor.specialization}</h3>
                                <h3>Assigned Patients : {doctor.assigned_patients}</h3>
                            </div>

                    )
                    })
                }
  </div>
)}
            </div>
      </div>
    </div>
    </div>
  )
}

export default Search_doctors
