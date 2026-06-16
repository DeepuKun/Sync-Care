import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
function MedicineList() {

  const [medicines, setMedicines] = useState([]);

  const fetchMedicines = async () => {
    try {
      const response = await fetch("http://localhost:5000/medicine");
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
    <div className="medicine_container">
      <h2>All Medicines</h2>

      <table className="medicine_table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Available</th>
            <th>Price</th>
            <th>Expiry</th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((med) => (
            <tr key={med.med_id}>
              <td>{med.med_id}</td>
              <td>{med.med_name}</td>
              <td>{med.available}</td>
              <td>{med.price}</td>
              <td>{med.expiry_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </motion.div>
  );
}

export default MedicineList;