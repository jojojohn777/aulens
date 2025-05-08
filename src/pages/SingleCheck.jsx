import React, { useState ,useEffect} from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";

const SingleCheck = ({ setScanActive, result, onCheck }) => {
  
  useEffect(() => {
    document.querySelectorAll('.single-check-take-pick').forEach(el => {
      if (el.querySelector('.btn-danger')) {
        const btnSecondary = el.querySelector('.btn-secondary');
        const btnPrimary = el.querySelector('.btn--primary');

        if (btnSecondary) {
          btnSecondary.style.width = '10px';
        }
        if (btnPrimary) {
          btnPrimary.style.display = 'none';
        }
      }
    });
  }, []);

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
    <section className="scan-photo-section" id="scan-photo">
      <div className="container main-section-hero">
        <div>
            <div className="sub-container">
            <label htmlFor="fileInput" className="custum-file-upload single-check-form">
              <div className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  style={{ fill: "#5df15d" }}
                >
                  <path d="M3 4v5h2V5h4V3H4a1 1 0 0 0-1 1zm18 5V4a1 1 0 0 0-1-1h-5v2h4v4h2zm-2 10h-4v2h5a1 1 0 0 0 1-1v-5h-2v4zM9 21v-2H5v-4H3v5a1 1 0 0 0 1 1h5zM2 11h20v2H2z"></path>
                </svg>
              </div>
              <div className="text">
                <span className="btn  btn-outline-primary mt-3 btn btn--primary color-black ">Upload picture</span>
              </div>
              <input id="fileInput" type="file" onChange={handleFileChange} />
            </label>
            <div className="tak-pic-div single-check-take-pick" >
              <button
                className="btn btn--primary tak-btn"
                onClick={handleCheck}
                disabled={!selectedFile}
              >
                Check
              </button>
              <button className="btn btn-secondary mx-2" onClick={()=>{setScanActive(false)}}>
                Back
              </button>
              {selectedFile && (
                <button className="btn btn-danger mx-2" onClick={handleReset}>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleCheck;
