import { useState } from "react";

function BloodRequest() {

  const [form, setForm] = useState({
    name: "",
    bloodGroup: "",
    location: "",
    phone: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await fetch("http://localhost:5000/api/blood/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    alert("Blood request sent!");

  };

  return (

    <div>
      <h2>Request Blood</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <input
          name="bloodGroup"
          placeholder="Blood Group"
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />

        <button type="submit">
          Request Blood
        </button>

      </form>

    </div>

  );

}

export default BloodRequest;