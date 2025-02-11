import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.scss"; // Import SCSS styles

const HomePage = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!phone.match(/^\d{10}$/)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const response = await fetch("http://localhost:5001/api/auth/check-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();
    if (data.exists) {
      localStorage.setItem("token", data.token);
      navigate(data.profileComplete ? "/questions" : "/profile");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="home-container">
      <div className="home-box">
        <h1 className="title">Enter Your Phone Number</h1>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          className="input"
        />
        <button onClick={handleSubmit} className="button">
          Continue
        </button>
      </div>
    </div>
  );
};

export default HomePage;
