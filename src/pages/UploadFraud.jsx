import React, { useEffect, useState } from "react";
import "./UploadFraud.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";

const UploadFraud = ({ handleShowFraudCustomerList }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImage, setImage] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isApkbaChecked, setIsApkbaChecked] = useState(false); // ✅ checkbox state
  const [result, setResult] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("this is the file");
    if (file) {
      setImage(URL.createObjectURL(file));
    }

    console.log(file);

    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!isApkbaChecked){
  alert("Please accept the terms and conditions before submitting.");
  return;

    }

    if (!selectedFile) return alert("Please select an image");
    setResult(`Uploading....`);
    try {
      const userid = localStorage.getItem("userid");
      const datetime = new Date().toISOString().slice(0, 19).replace("T", " ");

      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const requestBody = {
        ImageBuffer: base64Image,
        name,
        phone,
        aadharNumber: aadhar,
        address,
        message,
        userid,
        ImagePath: selectedFile.name,
        Date_Time: datetime,
        isApkba: isApkbaChecked ? 1 : 0, // ✅ send as 0 or 1
      };

      console.log(requestBody);

      const response = await axios.post(
        `${BASE_URL}/fraud-customer/create`,
        requestBody,
        {
          withCredentials: true, // allows cookies/session info to be sent
          headers: {
            "Content-Type": "application/json", // optional, set by default
          },
        }
      );

      const responseData = response.data;
      if (response.status === 200) {
        alert("Fraud record uploaded successfully!");
        setResult("");
        setName("");
        setPhone("");
        setAadhar("");
        setAddress("");
        setMessage("");
        setSelectedFile(null);
        setIsApkbaChecked(false); // ✅ reset checkbox
      } else {
        alert(
          `Failed to upload fraud record: ${
            responseData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload fraud record.");
    }
  };

  return (
    <section className="scan-photo-section" id="scan-photo">
      {/* Form Section */}
      {selectedFile && (
        <div className=" main-section-hero   upload-photo-container ">
          <section className="form-section upload-photo-form ">
            <div className="align-self-normal">
              <ul className="guide-list">
                <li>
                   വ്യക്തിയുടെ വിശദവിവരങ്ങൾ ഫീൽഡുകളിൽ{" "}
                  <span className="color-green">ടൈപ്പ് ചെയ്യുക</span>
                </li>
                <li>
                  തട്ടിപ്പിനെക്കുറിച്ചുള്ള{" "}
                  <span className="color-green">കുറിപ്പ് ചേർക്കുക</span>
                </li>
                <li>
                
                  <span className="color-green">
                    ആ വ്യക്തിയെ കുറിച്ചുള്ള വിവരങ്ങൾ നൽകാതെയും നിങ്ങൾക്ക് ഫോട്ടോ
                    അപ്‌ലോഡ് ചെയ്യാൻ കഴിയും.
                  </span>
                </li>
                <li>
                 <span className="color-green">നിബന്ധനകൾ വായിച്ചു </span>
                  സമ്മതമാണെങ്കിൽ ബോക്‌സിൽ{" "}
                  <span className="color-green">ടിക്ക് ചെയ്യുക</span>.
                </li>
                <li>
                <span className="color-green">Submit</span> ക്ലിക്ക്
                  ചെയ്യുക
                </li>
              </ul>
            </div>
            <div className="form-container">
              <div className="text">
                <h1>{(result?result:'Upload picture')}</h1>
              </div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  required
                />

                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Phone Number"
                />

                <label htmlFor="aadhar">Aadhaar Number:</label>
                <input
                  type="text"
                  id="aadhar"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  placeholder="Enter Aadhaar Number"
                />

                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address"
                />

                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  placeholder="Enter Message"
                  required
                ></textarea>

<div className="kyc-agreement ">
  <label className="kyc-checkbox-label">
    <input
      type="checkbox"
      id="apkba"
      checked={isApkbaChecked}
      onChange={(e) => setIsApkbaChecked(e.target.checked)}
      className="kyc-checkbox-input"
    />
    <span className="kyc-custom-checkbox"></span>
    <span className="kyc-agreement-text mal">
      ഞാൻ നിബന്ധനകളും വ്യവസ്ഥകളും വായിച്ചും സമ്മതിച്ചിരിക്കുന്നു. ഈ ഫോട്ടോ, മുക്കുപണ്ടം ജാമ്യമായി നൽകിയോ നൽകാൻ ശ്രമിച്ചയാളുടേതാണ്. മറ്റുള്ള gold-based lenders തിരിച്ചറിയാനും അറിയിപ്പുകൾ ലഭിക്കാനുമാണ് ഇത് അപ്‌ലോഡ് ചെയ്യുന്നത്.
    </span>
  </label>
</div>

                <button className="btn btn--primary tak-btn" type="submit">
                  Submit
                </button>

                <button
                  className="mx-2 btn btn-danger   tak-btn"
                  type="submit"
                  onClick={() => setSelectedFile(null)}
                >
                  Cancel{" "}
                </button>
              </form>
            </div>
            <div>
              <img src={currentImage} className="upload-photo-preview" alt="heyy" srcset="" />
            </div>
          </section>
        </div>
      )}
      {!selectedFile && (
        <div className=" main-section-hero   upload-photo-container">
          <div className="scan-photo-mob">
            <h1>Upload picture</h1> <br />
            <p className="mal">
              താങ്കളുടെ കസ്റ്റമർ വ്യാജമോ മോഷണത്തിലൂടെ ലഭിച്ചോ ആയ സ്വർണ്ണം
              പണയംവയ്ക്കാൻ ശ്രമിച്ചിട്ടുണ്ടെങ്കിൽ, അവരുടെ ഫോട്ടോ അപ്‌ലോഡ്
              ചെയ്യുക.
            </p>
            <p className="mal">
              താങ്കൾ അപ്‌ലോഡ് ചെയ്ത ഫോട്ടോ  <span className="green-text">ALPHA </span> ഡാറ്റാബേസിൽ സേവ്
              ചെയ്യപ്പെടും.മറ്റൊരു gold-based lender  <span className="green-text">ALPHA </span> ഉപയോഗിച്ച് നിങ്ങൾ
              അപ്‌ലോഡ് ചെയ്ത ഫോട്ടോ തിരിച്ചറിയുകയാണെങ്കിൽ, നിങ്ങൾക്ക് അറിയിപ്പ്
              ലഭിക്കും. നിങ്ങൾ ALPHAയുടെ സബ്സ്ക്രിപ്ഷൻ നിർത്തിയാലും, രണ്ട്
              വർഷംവരെ  <span className="green-text">ALPHA </span> സിസ്റ്റം നിങ്ങൾ അപ്‌ലോഡ് ചെയ്ത ഫോട്ടോക്ക് മാച്ച്
              അന്വേഷിക്കും.
            </p>
          </div>

          <div className="upload-photo-form">
              {/* Upload Button (from Uiverse.io by csemszepp) */}
              <div className="upload-photo-form-right">
            <label htmlFor="file" className="custum-file-upload cs-w">
              <div className="fraud-list-controls">
                <h5>{result}</h5>
                <button onClick={handleShowFraudCustomerList}>View/Edit</button>
              </div>
              <div className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  style={{ fill: "#5df15d" }}
                >
                  <path d="M3 4v5h2V5h4V3H4a1 1 0 0 0-1 1zm18 5V4a1 1 0 0 0-1-1h-5v2h4v4h2zm-2 10h-4v2h5a1 1 0 0 0 1-1v-5h-2v4zM9 21v-2H5v-4H3v5a1 1 0 0 0 1 1h5zM2 11h20v2H2z" />
                </svg>
              </div>
              <div className="text">
                <span className="btn--primary btn color-black">
                  {selectedFile ? selectedFile.name : "Upload Photo here"}
                </span>
              </div>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            </div>
            <div className="upload-photo-form-left">
              <ol className="guide-list">
                <li>
                  <span className="color-green">"Upload Photo"</span> എന്ന
                  ബട്ടണിൽ ക്ലിക്ക് ചെയ്യുക
                </li>
                <li>കമ്പ്യൂട്ടറിലെ ഫയലുകൾ തുറക്കപ്പെടും</li>
                <li>
                  അപ്‌ലോഡ് ചെയ്യാൻ ആഗ്രഹിക്കുന്ന{" "}
                  <span className="color-green">ചിത്രം തിരഞ്ഞെടുക്കുക</span>
                </li>
                <li>
                  <span className="color-green">Open ക്ലിക്ക്</span> ചെയ്യുക
                </li>
              </ol>
            </div>
          
          </div>
          <div className="mal bottom-greenIn color-green">
        <p>
          <b>  ഒരു ഫോട്ടോ തിരുത്തുകയോ നീക്കം ചെയ്യുകയോ വേണമെങ്കിൽ, Edit/Delete
          ഐക്കണിൽ ക്ലിക്ക് ചെയ്യുക.</b>
        </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default UploadFraud;
