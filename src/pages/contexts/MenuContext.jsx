import React from "react";

export const handleLogout = async () => {
  let login = false;

  console.log("logging out");

  localStorage.removeItem("userid");
  localStorage.removeItem("roleid");
  localStorage.removeItem("loginTime");
  // setLoginSuccess(false);
  console.log("Logged out");
  window.location.reload();
};
