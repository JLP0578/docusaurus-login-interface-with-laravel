import React, { useEffect } from "react";
import { useGlobalContext } from '../../context/GlobalState';

const Loading = () => {
  const { isLoad, verifyValidity} = useGlobalContext();

  let animationName = "spining";
  let keyframes = `
  @-webkit-keyframes ${animationName} {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;
  let html = (overflowValue) => `html { overflow: ${overflowValue}; }`;

  // - Add Keyframe to Style
  var styleEl = document.createElement("style");
  document.head.appendChild(styleEl);
  var styleSheet = styleEl.sheet;
  styleSheet.insertRule(keyframes, 0);
  styleSheet.insertRule(html("hidden"), 0);

  const styles = {
    loadingPage: {
      position: "absolute",
      width: "100%",
      height: "100%",

      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      rowGap: "30px",
      zIndex: "9999",

      backgroundColor: "#f5f5f5",
    },
    spinner: {
      width: "80px",
      height: "80px",
      animation: `${animationName} 1.5s linear infinite`,
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      verifyValidity();
      styleSheet.insertRule(html("auto!important"), 0);
    }, 1500);

    // clean du timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoad && (
        <div className="loading-page" style={styles.loadingPage}>
          <div className="spinner" style={styles.spinner}>
            <img
              src="/img/docusaurus_keyboard.svg"
              alt="docusaurus keyboard loading page"
            />
          </div>
          <p>Loading...</p>
        </div>
      )}
    </>
  );
};

export default Loading;
