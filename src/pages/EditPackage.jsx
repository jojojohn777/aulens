import React, { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

const EditPackage = ({ goBack, packageData }) => {
  const [formData, setFormData] = useState({ ...packageData });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value ? parseFloat(value) : "" });
    }
  };

  console.log(formData);

  const totalCost = (formData.face_Instance || 0) * (formData.Costper_face || 0) +
                    (formData.kyc_instance || 0) * (formData.Costper_kyc || 0);

  const finalPrice = totalCost - (totalCost * (formData.Discount || 0)) / 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      PackageName: formData.PackageName,
      Description: formData.Description,
      Total_Cost: totalCost.toFixed(2),
      Validity: formData.Validity,
      face_Instance: formData.face_Instance,
      kyc_instance: formData.kyc_instance,
      Discount: formData.Discount,
      Costper_face: formData.Costper_face,
      Costper_kyc: formData.Costper_kyc,
      Customise: formData.Customise
    };

    axios.put(
      `${BASE_URL}/package/update/${formData.Packageid}`,
      payload,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then(() => {
      alert("Package updated successfully!");
      goBack();
    })
    .catch((err) => console.error("Error updating package:", err));
  };

  return (
    <div>
      <h2>Edit Package</h2>
      <form onSubmit={handleSubmit}>
        <label>Package Name:</label>
        <input type="text" name="PackageName" value={formData.PackageName} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="Description" value={formData.Description} onChange={handleChange} />

        <label>Validity (Days):</label>
        <input type="number" name="Validity" value={formData.Validity} min="1" onChange={handleChange} required />

        <label>Face Instances:</label>
        <input type="number" name="face_Instance" value={formData.face_Instance} min="0" onChange={handleChange} />

        <label>Cost per Face:</label>
        <input type="number" name="Costper_face" value={formData.Costper_face} min="0" step="0.01" onChange={handleChange} />

        <label>KYC Instances:</label>
        <input type="number" name="kyc_instance" value={formData.kyc_instance} min="0" onChange={handleChange} />

        <label>Cost per KYC:</label>
        <input type="number" name="Costper_kyc" value={formData.Costper_kyc} min="0" step="0.01" onChange={handleChange} />

        <label>Discount %:</label>
        <input type="number" name="Discount" value={formData.Discount} min="0" max="100" step="0.01" onChange={handleChange} />

        <label>
          <input type="checkbox" name="Customise" checked={formData.Customise} onChange={handleChange} />
          Customise
        </label>

        <div><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</div>
        <div><strong>Final Price (After Discount):</strong> ${finalPrice.toFixed(2)}</div>

        <button type="submit">Update Package</button>
      </form>
      <button onClick={goBack}>Back</button>
    </div>
  );
};

export default EditPackage;
