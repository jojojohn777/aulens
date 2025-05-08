import React, { useState} from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

import axios from 'axios';

const AddPackage = ({goBack}) => {
  const [packageData, setPackageData] = useState({
    PackageName: '',
    Description: '',
    Total_Cost: '',
    Validity: '',
    face_Instance: '',
    kyc_instance: '',
    Discount: '',
    Costper_face: '',
    Costper_kyc: '',
    Customise: false, // Default false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPackageData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(
            `${BASE_URL}/package/create`,
            packageData,
            {
                withCredentials: true, // Include credentials (cookies, auth headers, etc.)
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
      alert('Package created successfully!');
      setPackageData({
        PackageName: '',
        Description: '',
        Total_Cost: '',
        Validity: '',
        face_Instance: '',
        kyc_instance: '',
        Discount: '',
        Costper_face: '',
        Costper_kyc: '',
        Customise: false,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Error creating package.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <h2>Create Package</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="PackageName"
          placeholder="Package Name"
          value={packageData.PackageName}
          onChange={handleChange}
          required
        /><br /><br />

        <textarea
          name="Description"
          placeholder="Description"
          value={packageData.Description}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="number"
          name="Total_Cost"
          placeholder="Total Cost"
          value={packageData.Total_Cost}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="number"
          name="Validity"
          placeholder="Validity (in days)"
          value={packageData.Validity}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="number"
          name="face_Instance"
          placeholder="Face Instance"
          value={packageData.face_Instance}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="number"
          name="kyc_instance"
          placeholder="KYC Instance"
          value={packageData.kyc_instance}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="number"
          name="Discount"
          placeholder="Discount (%)"
          value={packageData.Discount}
          onChange={handleChange}
        /><br /><br />

        <input
          type="number"
          name="Costper_face"
          placeholder="Cost per Face"
          value={packageData.Costper_face}
          onChange={handleChange}
        /><br /><br />

        <input
          type="number"
          name="Costper_kyc"
          placeholder="Cost per KYC"
          value={packageData.Costper_kyc}
          onChange={handleChange}
        /><br /><br />

        {/* ✅ Checkbox for Customise */}
        <label>
          <input
            type="checkbox"
            name="Customise"
            checked={packageData.Customise}
            onChange={handleChange}
          />
          Customise Package
        </label>

        <br /><br />
        <button type="submit">Create Package</button>
      </form>
      <button onClick={goBack}>Back</button>
    </div>
  );
};

export default AddPackage;
