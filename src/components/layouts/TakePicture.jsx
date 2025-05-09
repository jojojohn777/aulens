import React, { useState } from "react";
import Webcam from "react-webcam";
import SingleCheck from "../../pages/SingleCheck";

export default function TakePicture({
  result,
  capturedImage,
  webcamRef,
  handleCapture,
  setCapturedImage,
  setResult,
  handleCheck,
  handleHomeButton,
  isScanActive,
  setScanActive,
}) {
  return (
    <>
      <section className="main-section">
        <div className="container   ">
          <h1 className="text-bold mal gol green-text ">സ്വര്‍ണം പണയമായി എടുക്കുന്ന സമയത്ത്</h1> <br />
          <div className="d-flex flex-row  align-items-center gold-page-sec">
            <div className="gold-page-sec-p">
              {/* <h1>AuLens</h1> */}
              <p className="mal">
                1) നിങ്ങളുടെ അടുത്ത് പണയം വയ്ക്കാൻ വന്ന വ്വ്യക്തിയുടെ മുഖം
                വ്യക്തമായി കാണുന്ന രീതിയിൽ ഫോട്ടോ എടുക്കുക, <span className="color-green">
                   Press on "Take
                  picture"
                </span>
              </p>
             
              <p className="mal">
                {" "}
                2) കമ്പ്യൂട്ടറിൽ നിന്ന് ഫോട്ടോ അപ്‌ലോഡ് ചെയ്ത് ഡാറ്റാബേസുമായി
                താരതമ്യപ്പെടുത്തണമെന്നുണ്ടെങ്കിൽ <span className="color-green">“Scan picture” അമർത്തുക.</span> 
              </p>
              <p className="mal">
             3) അപ്പോൾ
                സ്ക്രീനിൽ കമ്പ്യൂട്ടറിലുള്ള ഫയലുകൾ കാണും. അതിൽ നിന്ന്
                നിങ്ങള്ക്ക് താരതമ്യം ചെയ്യേണ്ട ഫോട്ടോ തിരഞ്ഞെടുക്കുക, ശേഷം
                “Open” ക്ലിക്ക് ചെയ്യുക.
              </p>
            </div>
            <div className="camera-div">
              <p className="" style={{ fontSize: "larger" }}>
                {result}
              </p>
              {/* <!-- From Uiverse.io by csemszepp -->  */}
              <label for="file" className="custum-file-upload">
                <div className="text">
                  {isScanActive ? (
                    <SingleCheck
                      onCheck={handleCheck}
                      result={result}
                      setScanActive={setScanActive}
                    />
                  ) : (
                    ""
                  )}
                  {capturedImage ? (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="web-cam"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <Webcam
                      className="web-cam"
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                    />
                  )}
                </div>
              </label>

              <div className="tak-pic-div">
                {!isScanActive ? (
                  <button
                    type="button"
                    className="btn btn-outline-primary mt-3 btn btn--primary tak-btn"
                    onClick={() => {
                      handleCapture(), setScanActive(false);
                    }}
                  >
                    Take Picture
                  </button>
                ) : (
                  ""
                )}

                {capturedImage ? (
                  <>
                    <span className="mx-2"></span>
                    <button
                      type="button"
                      className="btn btn-outline-primary mt-3 btn btn--primary tak-btn"
                      onClick={() => {
                        setCapturedImage(false);
                        setResult("");
                        setScanActive(false);
                      }}
                    >
                      Reset
                    </button>
                  </>
                ) : (
                  ""
                )}
                {!capturedImage ? (
                  <>
                    <span className="mx-2"></span>
                    <button
                      type="button"
                      className="btn btn-outline-primary mt-3 btn btn--primary tak-btn"
                      onClick={() => {
                        setCapturedImage(false);
                        setResult("");
                        setScanActive(true);
                      }}
                    >
                      Scan picture..
                    </button>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="gold-page-sec-p">  
              {/* <h1>AuLens</h1> */}
              <p className="mal">
                4). ഡാറ്റാബേസുമായി താരതമ്യം ചെയ്യും നിങ്ങൾ എടുത്ത ഫോട്ടോ,
                gold-based lenders <span className="color-green">
                  റിപ്പോർട്ട് ചെയ്ത്, ALPHA ഡാറ്റാബേസിൽ
                  അപ്‌ലോഡ് ചെയ്ത,
                </span> വ്യാജമോ മോഷണത്തിലൂടെ ലഭിച്ച സ്വർണ്ണം
                പണയംവച്ചവരുടെ ഫോട്ടോകളുമായി താരതമ്യപ്പെടുത്തപ്പെടും..
              </p>
              <p className="mal">
                5). <span className="color-green">മാച്ച് കിട്ടിയാൽ അറിയിപ്പ് ലഭിക്കും മാച്ച് കിട്ടിയാൽ,</span>
                നിങ്ങൾക്കും ആ <span className="color-green">ചിത്രം അപ്‌ലോഡ് ചെയ്ത </span>ലെൻഡറിനും അറിയിപ്പ്
                ലഭിക്കും. അതുപോലെ, ആ ചിത്രമെടുത്ത <span className="color-green">
                  വ്യക്തിയുടെ ഫോൺ നമ്പറും മറ്റു
                  വിവരങ്ങളും നിങ്ങൾക്ക് കാണാനാകും. ഇത് വഴി, നിങ്ങൾക്ക് ആ
                  വ്യക്തിയുമായി നേരിട്ട് ബന്ധപ്പെടാനും
                </span> വിശദീകരണം തേടാനും കഴിയും.
              </p>
            </div>
          </div>
          <div className=" gold-page-sec-p1 gold-page-sec-p mt-5">
            {/* <h1>AuLens</h1> */}
            <p className="mal bottom-greenIn green-text"> <b>
            മാച്ച് ലഭിക്കാത്തപക്ഷം ഒരു മാച്ച് ലഭിക്കാത്തപക്ഷം, "Face not
              found” എന്ന് കാണിക്കും. അതിനുശേഷം, നിങ്ങൾക്ക് സാധാരണപോലെ ലെൻഡിംഗ്
              തുടരാം.
            </b>
               
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
