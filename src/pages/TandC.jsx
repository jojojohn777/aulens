import React, { useState } from "react";


const TandC = ({ isOpen, onClose, onAccept, onDecline }) => {
  const [language, setLanguage] = useState("english");

  if (!isOpen) return null;

  const handleClickOutside = (e) => {
    if (e.target.className === "au-modal-overlay") {
      onClose();
    }
  };

  return (
    <div className="au-modal-overlay" onClick={handleClickOutside}>
      <div className="au-modal-content">
        <div className="au-modal-header">
          <h2 className="au-modal-title">
            {language === "english"
              ? "User Agreement and Terms of Use"
              : "ഉപയോക്തൃ കരാറും ഉപയോഗ നിബന്ധനകളും"}
          </h2>
          <button className="au-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="au-modal-body">
          <p>By accessing or using this system, you agree to the following:</p>

          <ol className="au-terms-list">
            <li>
              You are solely responsible for any data you upload, including
              photos and information of individuals. Uploading incorrect or
              malicious data is strictly prohibited.
            </li>
            <li>
              The system may show matches based on facial similarities. It is
              your responsibility to verify the identity of the person before
              taking any action. AU Lens is not liable for any consequences of a
              mistaken identity.
            </li>
            <li>
              AU Lens only facilitates identification through its platform. Any
              decisions taken after a match, including legal or personal
              actions, are solely between the uploader and the identifying
              business.
            </li>
            <li>
              Do not share your login credentials with others. Any activity done
              through your account will be treated as your action.
            </li>
            <li>
              The platform tracks and logs user activity for security and
              accountability.
            </li>
            <li>
              Misuse of the system may lead to legal action and permanent
              account termination.
            </li>
            <li>
              This system may evolve, and by continuing to use it, you agree to
              any future updates in the Terms of Use.
            </li>
          </ol>

          <p className="au-warning-text">
            If you do not agree to these terms, do not proceed to use the
            application.
          </p>

        </div>

        <div className="au-modal-footer">
          <button className="au-btn au-btn-secondary" onClick={onDecline}>
            Decline
          </button>
          <button className="au-btn au-btn-primary" onClick={onAccept}>
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TandC;
