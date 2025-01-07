import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { GlobalProvider } from "../context/GlobalState";
import Loading from "../components/Pages/Loading";
import Authenticator from "../components/Pages/Authenticator";
import Content from "../components/Pages/Content";

const Root = ({ children }) => {
  return (
    <>
      <GlobalProvider>
        <Authenticator />
        <BrowserOnly fallback={null}>
          {() => {
            return (
              <>
                <Loading />
                <Content>{children}</Content>
              </>
            );
          }}
        </BrowserOnly>
      </GlobalProvider>
    </>
  );
};

export default Root;
