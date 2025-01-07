import React, { useEffect } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useGlobalContext } from "../../context/GlobalState";

function Content({ children }) {
  const { isLoad, isAuth, verifyValidity } = useGlobalContext();
  const {
    siteConfig: {
      customFields: { TimeBeforeNewValidation },
    },
  } = useDocusaurusContext();

  function useLocalStorageListener(onChange) {
    useEffect(() => {
      const handleStorageChange = (event) => {
        if (event.storageArea === localStorage) {
          onChange(event.key, event.oldValue, event.newValue);
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }, [onChange]);
  }

  useLocalStorageListener((key, oldValue, newValue) => {
    if (key == "authToken") {
      verifyValidity();
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      verifyValidity();
    }, TimeBeforeNewValidation);

    return () => clearInterval(interval);
  }, []);

  return <>{!isLoad && isAuth && children}</>;
}

export default Content;
