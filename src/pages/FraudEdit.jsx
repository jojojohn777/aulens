import React, { useState } from 'react';
import './FraudEdit.css';

const FraudEdit = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: customer.name || "",
  phone: customer.phone || "",
  aadharNumber: customer.aadharNumber || "",
  address: customer.address || "",
  message: customer.message || ""

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(customer.id, formData);
  };

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit} className="fraud-edit-form">
        <h3>Edit Customer</h3>
        <div className="image-preview">
          {customer.ImagePath ? (
            <img
              src={`http://localhost:1337/images/${customer.ImagePath}`}
              alt={customer.name}
              className="customer-image-edit"
            />
          ) : (
            'No Image'
          )}
        </div>
        <input
         type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          placeholder="Enter name "
        />
<input
  type="text"
  name="phone"
  value={formData.phone || ""}
  onChange={handleChange}
  placeholder="Enter phone "
/>
<input
  type="text"
  name="aadharNumber"
  value={formData.aadharNumber || ""}
  onChange={handleChange}
  placeholder="Enter Aadhar Number"
/>
<input
  type="text"
  name="address"
  value={formData.address || ""}
  onChange={handleChange}
  placeholder="Enter Address"
/>
<input
  type="text"
  name="message"
  value={formData.message || ""}
  onChange={handleChange}
  placeholder="Enter Message "
/>
        <div className="button-group">
          <button type="submit">Save</button>
          <button type="button" style={{ marginLeft: '10px' }} onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default FraudEdit;
