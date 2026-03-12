import { useState } from "react";

function BloodDonors() {

  const [group, setGroup] = useState("");
  const [donors, setDonors] = useState([]);

  const searchDonors = async () => {

    const res = await fetch(
      `http://localhost:5000/api/blood/donors/${group}`
    );

    const data = await res.json();

    setDonors(data);

  };

  return (

    <div>

      <h2>Find Blood Donors</h2>

      <input
        placeholder="Enter Blood Group"
        onChange={(e) => setGroup(e.target.value)}
      />

      <button onClick={searchDonors}>
        Search
      </button>

      <ul>
        {donors.map((d, index) => (
          <li key={index}>
            {d.name} - {d.phone}
          </li>
        ))}
      </ul>

    </div>

  );

}

export default BloodDonors;