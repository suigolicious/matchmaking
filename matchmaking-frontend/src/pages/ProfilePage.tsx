import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const navigate = useNavigate();

  const handleProfileSubmit = async () => {
    const response = await fetch('/api/auth/complete-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name, age }),
    });

    if (response.ok) {
      localStorage.setItem('profileComplete', 'true'); // Mark profile as complete
      navigate('/questions');
    }
  };

  return (
    <div>
      <h1>Create Your Profile</h1>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
      <button onClick={handleProfileSubmit}>Continue</button>
    </div>
  );
};

export default ProfilePage;
