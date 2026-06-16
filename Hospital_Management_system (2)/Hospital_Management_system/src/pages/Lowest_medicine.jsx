import React,{useEffect, useState} from 'react'
import { data } from 'react-router-dom';

const Lowest_medicine = () => {

    let [LowestMed, setLowestMed] = useState(null);
    useEffect(()=>{
        fetch('http://localhost:5000/lowest-medicines')
        .then(res=>res.json())
        .then(data=> setLowestMed(data))
    },[])
  return (
    <div className='lowest-Med-Container'>
            <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Lowest Medicines</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='lowest_medicine_container'>
        <h1>Medicines with the lowest stock :</h1>
        {
            LowestMed && LowestMed.length > 0 ? (
                <ul>
                    {LowestMed.map(med => (
                        <li key={med.med_id}>
                            <strong>{med.med_name}</strong> - Stock: {med.available}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No medicines with low stock available.</p>
            )

        }
        </div>
    </div>
  )
}

export default Lowest_medicine
