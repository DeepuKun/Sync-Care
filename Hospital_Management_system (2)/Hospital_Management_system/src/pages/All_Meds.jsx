import {React, useState} from 'react'
import '../components/css_folder/med.css'
import { motion } from 'framer-motion';
const All_Meds = () => {
    const [formData, setFormData] = useState({
    med_id: "",
    med_name: "",
    available: "",
    price: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          med_id: Number(formData.med_id),
          med_name: formData.med_name,
          available: Number(formData.available),
          price: Number(formData.price)
        })
      });

      const data = await response.json();
      alert(data.message);

      // Reset form
      setFormData({
        med_id: "",
        med_name: "",
        available: "",
        price: ""
      });

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };
  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div className='med_add'>
               <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Medicine Page</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
       <form onSubmit={handleSubmit} className='med_form'>
        <h2>Enter Medicine Details...</h2>
      <input
        type="number"
        name="med_id"
        placeholder="   Medicine ID..."
        value={formData.med_id}
        onChange={handleChange}
      />

      <input
        type="text"
        name="med_name"
        placeholder="   Medicine Name..."
        value={formData.med_name}
        onChange={handleChange}
      />

      <input
        type="number"
        name="available"
        placeholder="   Available Stock..."
        value={formData.available}
        onChange={handleChange}
      />

      <input
        type="number"
        step="0.01"
        name="price"
        placeholder="   Price..."
        value={formData.price}
        onChange={handleChange}
      />

      <button type="submit">Add Medicine</button>
    </form>
    </div>
    </motion.div>
  )
}

export default All_Meds
