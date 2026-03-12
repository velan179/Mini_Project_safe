import { useState } from "react";

function DonorRegister() {

  const [form, setForm] = useState({
    name: "",
    bloodGroup: "",
    city: "",
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

    await fetch("http://localhost:5000/api/blood/donor/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    alert("Donor Registered!");

  };

  return (

    <div>
      <h2>Become a Blood Donor</h2>

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
          name="city"
          placeholder="City"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />

        <button type="submit">
          Register
        </button>

      </form>

    </div>

  );

}

export default DonorRegister;