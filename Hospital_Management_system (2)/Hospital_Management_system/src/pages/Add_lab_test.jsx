import React, { useEffect, useState } from 'react'

const Add_lab_test = () => {

    const [labTest, setLabTest] = useState({
        patient_id:"",
        test_type:"",
        sub_type:""
    });
    const handleChange=(e)=>{
        setLabTest((prev)=>({
            ...prev,
            [e.target.name]:e.target.value
        }))
    }

    const handleSubmit=async(e)=>{
        
            e.preventDefault();
                try{
                    const response = await fetch('http://localhost:5000/add-lab-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(labTest)
        });

        const data = await response.json();
        console.log(data);

                    
                }catch(err){
                    console.log(err);
                }
                
            
        setLabTest({
    patient_id: "",
    test_type: "",
    sub_type: ""
});
    }
  return (
    <div className='add-lab-test-container'>
      <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Add Lab Test</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='lab-test-input-container'>
        <form className='lab-test-input' onSubmit={handleSubmit}>
            <input name='patient_id' value={labTest.patient_id} onChange={handleChange} placeholder='    Enter Patient ID...'></input>
            <input name='test_type' value={labTest.test_type} onChange={handleChange} placeholder='    Enter Test Type...'></input>
            <input name='sub_type' value={labTest.sub_type} onChange={handleChange} placeholder='    Enter Test Sub Type...'></input>
            <button type='submit'>Add</button>
        </form>
      </div>
    </div>
  )
}

export default Add_lab_test
