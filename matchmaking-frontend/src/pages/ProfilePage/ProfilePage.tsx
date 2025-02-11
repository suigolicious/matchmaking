import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.scss"; // Import SCSS styles

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null); // Error state for file validation

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload an image (JPG, PNG, GIF, WEBP).");
      return;
    }

    // File is valid, reset errors
    setError(null);
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file)); // Show the preview
  };

  const handleSubmit = async () => {
    if (!profile.name || !profile.age || !profile.gender || !image) {
      setError("All fields are required, including your profile picture.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("age", profile.age);
    formData.append("gender", profile.gender);
    if (image) {
      formData.append("profileImage", image);
    }

    const response = await fetch("http://localhost:5001/api/auth/profile", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData, // Use FormData for file uploads
    });

    if (response.ok) {
      navigate("/questions");
    } else {
      alert("Error saving profile.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h1 className="title">Complete Your Profile</h1>
        {/* Circular Image Preview */}
        {previewUrl ? (
          <img src={previewUrl} alt="Profile Preview" className="image-preview" />
        ) : (
          <img src="/default-profile.png" alt="" className="image-preview" />
        )}

        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
        {/* Hidden File Input with Custom Label */}
        <input type="file" id="file-upload" accept="image/*" onChange={handleFileChange} className="file-input" />

        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Enter your name"
          className="input"
        />
        <input
          type="number"
          value={profile.age}
          onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          placeholder="Enter your age"
          className="input"
        />
        
        {/* Gender Selection Field */}
        <select
          value={profile.gender}
          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
          className="gender-select"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button onClick={handleSubmit} className="button">
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
