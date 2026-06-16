import {React, useState} from 'react'
import { motion } from 'framer-motion';
const Search_med = () => {
     const [searchId, setSearchId] = useState("");
     const [medicine, setMedicine] = useState(null);
     const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchId) return;

    try {
      const response = await fetch(
        `http://localhost:5000/medicine/${searchId}`
      );

      if (!response.ok) {
        throw new Error("Medicine not found");
      }

      const data = await response.json();
      setMedicine(data);
      setError("");

    } catch (err) {
      setMedicine(null);
      setError("Medicine not found");
    }
  };
  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div>
      <div className="search_page">
               <div className='login_page_header norole_header prescription_search_header'>
          <img src= 'https://i.pinimg.com/736x/56/c9/50/56c950da2d259ac9e93bec3b0f93d1fb.jpg'></img>
          <h1>Ever<span className='light'>light</span> Hospital</h1>
          <h3>powered by <span className='synccare'>SyncCare</span></h3>
          <h1>|</h1>
          <h1>Login Page</h1>
          <img src='https://i.pinimg.com/736x/74/67/8b/74678bf4b994c7523e4b09b58688e1c9.jpg'></img>
      </div>
      <div className='med-search-container'>
         <h2>Search Medicine</h2>

      <div className="search_box">
        <input
          type="number"
          placeholder="Enter Medicine ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error_text">{error}</p>}

      {medicine && (
        <div className="result_card">
          <p><strong>ID:</strong> {medicine.med_id}</p>
          <p><strong>Name:</strong> {medicine.med_name}</p>
          <p><strong>Available:</strong> {medicine.available}</p>
          <p><strong>Price:</strong> {medicine.price}</p>
          <p><strong>Expiry:</strong> {medicine.expiry_date}</p>
        </div>
      )}
    </div>
      </div>
    </div>
    </motion.div>
  )
}

export default Search_med
