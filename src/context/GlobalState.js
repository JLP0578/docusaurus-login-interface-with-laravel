import React, { createContext, useContext, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import axios from "axios";

// Create context
const GlobalContext = createContext();

// Provider component (state, actions)
export const GlobalProvider = ({ children }) => {
  const [isLoad, setIsLoad] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const {
    siteConfig: {
      customFields: { AppUrl },
    },
  } = useDocusaurusContext();

  const beaver = () => {
    return localStorage.getItem("authToken") || "";
  };
  const setBeaver = (str) => {
    localStorage.setItem("authToken", str);
  };

  const verifyValidity = () => {
    if (beaver() != "") {
      axios
        .get(AppUrl + "/api/docu/valid", {
          headers: {
            Authorization: beaver(),
          },
        })
        .then((res) => {
          if (res.status == 200) {
            setIsAuth(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setBeaver("");
          setIsAuth(false);
        })
        .finally(() => {
          setIsLoad(false);
        });
    } else {
      setEmail("");
      setPassword("");
      setIsAuth(false);
      setIsLoad(false);
    }
  };

  const loginApi = () => {
    axios
      .post(AppUrl + "/api/docu/login", {
        email,
        password,
      })
      .then((res) => {
        setIsLoad(true);
        if (res.status == 200) {
          setBeaver(res.data.token_type + " " + res.data.token);
          axios.defaults.headers.common["Authorization"] = beaver();
          verifyValidity();
        }
      })
      .catch((error) => {
        setMessage(error?.response?.data?.message || "Login failed");
      })
      .finally(() => {
        setIsLoad(false);
      });
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoad,
        setIsLoad,
        isAuth,
        setIsAuth,
        beaver,
        setBeaver,
        verifyValidity,
        loginApi,
        email,
        setEmail,
        password,
        setPassword,
        message,
        setMessage,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
