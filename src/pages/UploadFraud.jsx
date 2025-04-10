import React, { useState } from 'react';
import './UploadFraud.css'; // We'll create this CSS file.

const UploadFraud = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return alert('Please select an image');
  

    try {
      const userid = localStorage.getItem('userid');
      console.log('User ID:', userid);  
      const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const requestBody = {
        ImageBuffer: base64Image,
        name,
        phone,
        aadharNumber:aadhar,
        address:address,
        message:message,
        userid,
        ImagePath: selectedFile.name,
        Date_Time: datetime
      };
     console.log(requestBody);
      const response = await fetch('http://localhost:1337/fraud-customer/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log('Response:', responseData);
      if (response.ok) {
        alert('Fraud record uploaded successfully!');
        setName('');
        setPhone('');
        setAadhar('');
        setAddress('');
        setMessage('');
        setSelectedFile(null);
      } else {
        alert(`Failed to upload fraud record: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload fraud record.');
    }
  };

  return (
    <div className="fraud-container">
      <h2>Upload Fraud Image</h2>
      <div className="form-group">
        <label>Image Upload:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-control"
        />
      </div>

      {selectedFile && (
        <>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter Phone Number"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Aadhar Number:</label>
            <input
              type="text"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              placeholder="Enter Aadhar Number"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Address"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter Message"
              className="form-control"
            />
          </div>

          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </>
      )}
    </div>
  );
};

export default UploadFraud;
