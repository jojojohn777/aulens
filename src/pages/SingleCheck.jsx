import React, { useState } from "react";

const SingleCheck = ({ onBack, onCheck }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCheck = () => {
    if (selectedFile) {
      onCheck(selectedFile); // Pass the file to onCheck if needed
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
  };

  return (
    <div className="text-center p-4">
      <h2>Single Check</h2>
      <label htmlFor="fileInput" className="form-label">
        Select a file:
      </label>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        className="form-control my-3"
      />
      <button className="btn btn-primary" onClick={handleCheck} disabled={!selectedFile}>
        Check
      </button>
      <button className="btn btn-secondary mx-2" onClick={onBack}>
        Back
      </button>
      {selectedFile && (
        <button className="btn btn-danger mx-2" onClick={handleReset}>
          Reset
        </button>
      )}
    </div>
  );
};

export default SingleCheck;
