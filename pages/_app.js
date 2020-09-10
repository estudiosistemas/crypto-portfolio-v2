import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { darkTheme, lightTheme } from "../src/theme";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import firebase, { FirebaseContext } from "../firebase";
import useAutenticacion from "../hooks/useAutenticacion";
import { Container } from "@material-ui/core";
import { SnackbarProvider } from "notistack";

export default function MyApp(props) {
  const { Component, pageProps } = props;
  const usuario = useAutenticacion();
  const [darkMode, setDarkMode] = useState(false);

  const changeTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>CryptoPortfolio</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <FirebaseContext.Provider
        value={{
          firebase,
          usuario,
        }}
      >
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <SnackbarProvider maxSnack={3} autoHideDuration={1000}>
            <Header darkMode={darkMode} changeTheme={changeTheme} />
            <Container>
              <Component {...pageProps} />
            </Container>
            <Footer />
          </SnackbarProvider>
        </ThemeProvider>
      </FirebaseContext.Provider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
