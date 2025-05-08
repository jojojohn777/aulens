import React from "react";
import HeaderComponent from "../components/layouts/Header";
import HomePage from "../components/HomePage";
import SEO from "../components/common/SEO";

export default function Index({
  result,
  capturedImage,
  webcamRef,
  handleCapture,
}) {
  return (
    <>
      <SEO
        title="My React App"
        description="A single-page React application"
        keywords="react, app, single-page"
      />
      <HeaderComponent />
      <HomePage />
    </>
  );
}
