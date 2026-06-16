import React, { useEffect, useState } from 'react'
import '.././components/css_folder/lab.css'
const Front_lab_page = () => {

    const [patients, setPatients] = useState([]);
    const [dept , setDept] = useState('');
    const [techs, setTechs] = useState([]);
    const [patientID, setPatientID] = useState('');
    const [labTestData,setlabTestData] = useState([]);
    const [labTechID, setLabTechID] = useState('');

   const assignLabTech = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(
      `http://localhost:5000/assign-lab-tech/${patientID}/${labTechID}`,
      {
        method: "POST"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    alert("Lab Technician assigned successfully 😎🔥");
    console.log(data);

  } catch (err) {
    alert("Error: " + err.message);
  }
  setPatientID('');
  setLabTechID('');
};
    const handleSubmit=(e)=>{
        e.preventDefault();
        const fetchLabTests = async()=>{
            try{
                const response = await fetch(`http://localhost:5000/patient-lab-tests/${patientID}`)
                const data = await response.json();
                setlabTestData(data)
            }catch(err){
                console.log(err)
            }
            

        }
        fetchLabTests();
    }
    useEffect(()=>{
        if (!dept) return;
        const fetchTechs = async() =>{
            try{
                const response = await fetch(`http://localhost:5000/lab-dept/${dept}`)
                const data = await response.json();
                setTechs(data);
            }catch(err){
                console.log(err);
            }
        }
        fetchTechs();
    },[dept])

    useEffect(()=>{
        fetchPatients();
    },[])

    const fetchPatients = async()=>{
        try{
            const response = await fetch('http://localhost:5000/waiting-lab-patients');
            const data = await response.json();
            setPatients(data);
        }catch(err){
            alert(err);
        }
    }
  return (
    <div className='waiting-lab-patients'>
       <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Waiting Queue</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='waiting-lab-test-list'>
        <div>
            {
            patients.map((patient)=>{
                return(
                   <div className='lab-test-card' key={patient.patient_id}>
                   <h3><img src='https://i.pinimg.com/736x/71/32/e2/7132e2a8d9348fe162e01f79e4bee80a.jpg'></img> {patient.patient_name}</h3>
                   <h3>ID : {patient.patient_id}</h3>
                   <h3>ADDRESS : {patient.address}</h3>
                   <h3>STATUS : {patient.test_status}</h3>
                   </div>
                );
            })
        }
        </div>
        <div className='add-lab-details'>
            <form onSubmit={handleSubmit}>
                <h2>Enter Patient ID to check the lab test type : </h2>
                <br></br>
                <input value={patientID} onChange={(e)=>{setPatientID(e.target.value)}} placeholder='   Enter ID...'></input>
                <button type='submit'>Enter</button>
                <div>
                    {
                        labTestData.map((data)=>(
                            <div key={data.test_id}className='lab-test-data-card' > 
                                <h3>Test Type : {data.test_type}</h3>
                                <h3>Test Sub Type : {data.sub_type}</h3>
                            </div>
                        ))
                    }
                </div>
            </form>
            <br></br>
            <form onSubmit={assignLabTech}>
               <h2> Assign Lab Technician :</h2> 
               
               <br></br>
                <input value={labTechID} onChange={(e)=>{setLabTechID(e.target.value)}} placeholder='   Enter Assigned Lab Technician...'></input>
                <button type='submit'>Enter</button>
            </form>
        </div>
                <div className='view-all-lab-tech'>
                    <button onClick={() => setDept("Hematology")}>Hematology</button>
                    <button onClick={() => setDept("Microbiology")}>Microbiology</button>
                    <button onClick={() => setDept("Immunology")}>Immunology</button>
                    <button onClick={() => setDept("Endocrinology")}>Endocrinology</button>
                    <button onClick={() => setDept("Histopathology")}>Histopathology</button>
                    <button onClick={() => setDept("Radiology")}>Radiology</button>
                    <button onClick={() => setDept("Pathology")}>Pathology</button>
                    <button onClick={() => setDept("Biochemistry")}>Biochemistry</button>

                    <div>
                        <h2>{`Lab Technicians for ${dept} : `}</h2>
                        {
                            techs.map((tech)=>(
                                <div className='lab-techs-card' key={tech.lab_tech_id}>
                                    <h3>{tech.name}</h3>
                                    <h3>{tech.lab_tech_id}</h3>
                                    <h3>{tech.assigned_patients}</h3>
                                </div>
                            ))
                        }
                    </div>
        </div>
      </div>

    </div>
  )
}

export default Front_lab_page
