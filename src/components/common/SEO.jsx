import React from "react";
// If you intend to use react-helmet, uncomment the import and wrapper tags
// import { Helmet } from "react-helmet";

const SEO = ({ title, description, keywords, canonicalUrl }) => {
  return (
    <>
      {/* Uncomment the below and wrap inside <Helmet> if using react-helmet */}
      {/* <Helmet> */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        {/* Viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Google Fonts and preconnect optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Leckerli+One&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Wix+Madefor+Text:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />

        {/* External stylesheets */}
        <link
          href="https://unpkg.com/aos@2.3.1/dist/aos.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        {/* If you are using a local Font Awesome path, ensure it exists */}
        <link
          rel="stylesheet"
          href="path/to/font-awesome/css/font-awesome.min.css"
        />
      {/* </Helmet> */}
    </>
  );
};

export default SEO;
