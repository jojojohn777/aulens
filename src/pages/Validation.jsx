import React, { useState } from "react";
// import "./ValidationButtons.css";
import Aadhar from "./Aadhar";
import VoterID from "./VoterId";
import DrivingLicense from "./DrivingLicense";
import Passport from "./Passport";

const Validation = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleValidate = (type) => {
    setSelectedComponent(type);
  };

  const handleBack = () => {
    setSelectedComponent(null);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "VoterID":
        return <VoterID />;
      case "DrivingLicense":
        return <DrivingLicense />;
      case "Aadhar":
        return <Aadhar />;
      case "Passport":
        return <Passport />;
      default:
        return null;
    }
  };

  return !selectedComponent ? (
    <>
      <section className="kyc-section">
        <div className="container kyc">
          <div className="left">
            <h1 className="e">e-KYC</h1>
          </div>
          <div className="right">
            <button
              className="btn btn--primary"
              onClick={() => handleValidate("VoterID")}
            >
              Validate Voter ID
            </button>
            <button
              className="btn btn--primary"
              onClick={() => handleValidate("DrivingLicense")}
            >git remote -v

              Validate Driving License
            </button>
            <button
              className="btn btn--primary"
              onClick={() => handleValidate("Aadhar")}
            >
              Validate Aadhar
            </button>
            <button
              className="btn btn--primary"
              onClick={() => handleValidate("Passport")}
            >
              Validate Passport
            </button>

            
          </div>
        </div>
      </section>
    </>
  ) : (
    <div className="component-display">
      <button className="back-button" onClick={handleBack}>
        ⬅ Back
      </button>
      {renderComponent()}
    </div>
  );
};

export default Validation;
