import React from "react";
// import { onLogout } from "../../pages/contexts/MenuContext";
export default function HeaderComponent({
  onLogout,
  handleShowAddToDatabase,
  handleValidation,
  handleSingleCheck,
  handleHomeButton,
  changePass,
  addUser,
  copyLink,
  handleActivity,
}) {
  return (
    <>
      <header className="header">
        <div className="container wrapper">
          <div className="header__logo">
            <img
              className="logo-au"
              src="https://ik.imagekit.io/rch00fvdg/aulens/logo.png?updatedAt=1746009113939"
              alt=""
            ></img>
          </div>

          <nav className="header__nav">
            <ul className="nav__list">
              <li className="nav__item">
                <button className="nav__link " onClick={handleHomeButton}>
                  Scan photo
                </button>
              </li>
              <li className="nav__item">
                <a
                  href="#"
                  className="nav__link"
                  onClick={handleShowAddToDatabase}
                >
                  Upload photo
                </a>
              </li>
              <li className="nav__item">
                <a href="#" className="nav__link" onClick={handleValidation}>
                  E-KYC
                </a>
              </li>

              {/* <li className="nav__item">
                <button className="nav__link " onClick={handleSingleCheck}>
                  Single Check
                </button>
              </li> */}
              <li className="nav__item dropdown menu-item-with-dropdown">
                <a href="#" className="nav__link dropdown__toggle">
                  Menu <i className="fas fa-chevron-down"></i>
                </a>
                <ul className="dropdown__menu meubar-drop" data-aos="fade-down">
                  <li>
                    <a href="#" onClick={changePass}>
                      Change password
                    </a>
                  </li>

                  <li>
                    <a href="#" onClick={addUser}>
                      Add branch
                    </a>
                  </li>

                  <li>
                    <a href="#" onClick={copyLink}>
                      Copy link
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleActivity}>
                      {" "}
                      Usage statistics{" "}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>

          <div className="header__cta">
            <a href="#" onClick={changePass}>
              Change Password
            </a>
          </div>
          <div className="header__cta">
            <a onClick={onLogout}>Logout</a>
          </div>

          {/* //   <!-- Hamburger for Mobile --> */}
          <div className="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>
      <div className="mobile-menu" id="mobileMenu">
        <button href="#" onClick={handleShowAddToDatabase}>
          Upload Photoo
        </button>

        <a href="#">Adhaar</a>
        <a href="#">Scan Photo</a>

        {/* <!-- Dropdown for mobile --> */}
        <div className="mobile-dropdown">
          <a href="#" className="mobile-dropdown-toggle">
            Menu <i className="fas fa-chevron-down"></i>
          </a>
          <ul className="mobile-dropdown-menu">
            <li>
              <a href="#">User Guide</a>
            </li>
            <li>
              <a href="#">Usage Statistics</a>
            </li>
            <li>
              <a href="#">Add branch</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
