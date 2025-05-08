import Webcam from "react-webcam";
import "../globals/style.css";
import "../globals/override.css";
import SEO from "./common/SEO";
import HeaderComponent from "./layouts/Header";

export default function HomePage({
  result,
  capturedImage,
  webcamRef,
  handleCapture,
}) {
  return (
    <>
      <HeaderComponent />

      <section className="main-section">
        <div className="container  main-section-hero">
          <div>
            <h1>AuLens</h1>
          </div>
          <div>
            {/* <!-- From Uiverse.io by csemszepp -->  */}
            <label for="file" className="custum-file-upload">
              <div className="icon">
                {/* <svg
                  width="84"
                  height="84"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C10.067 2 8.5 3.567 8.5 5.5C8.5 7.433 10.067 9 12 9C13.933 9 15.5 7.433 15.5 5.5C15.5 3.567 13.933 2 12 2ZM10.5 5.5C10.5 4.672 11.172 4 12 4C12.828 4 13.5 4.672 13.5 5.5C13.5 6.328 12.828 7 12 7C11.172 7 10.5 6.328 10.5 5.5Z"
                    fill="#5df15d"
                  />
                  <path
                    d="M3 20C3 16.134 7.03 14 12 14C16.97 14 21 16.134 21 20C21 20.552 20.552 21 20 21H4C3.448 21 3 20.552 3 20ZM12 16C8.534 16 5.88 17.566 5.17 19H18.83C18.12 17.566 15.466 16 12 16Z"
                    fill="#5df15d"
                  />
                  <path
                    d="M16 7H20L21 8V12C21 12.552 20.552 13 20 13H16C15.448 13 15 12.552 15 12V8C15 7.448 15.448 7 16 7Z"
                    fill="#5df15d"
                  />
                  <circle cx="18" cy="10" r="1.5" fill="#111312" />
                </svg> */}
              </div>
              <p className="bg-white" style={{ fontSize: "larger" }}>{result}</p>
              <div className="text">
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
              {" "}
              <button
                type="button"
                className="btn btn-outline-primary mt-3 btn btn--primary tak-btn"
                onClick={handleCapture}
              >
                Take Picture
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
