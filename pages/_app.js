import { withApollo } from "../lib/apollo";
import { SnackbarProvider } from "notistack";
import React, { useState } from "react";
import Head from "next/head";
import { yellow, grey } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: yellow[700]
    },
    secondary: {
      main: grey[700]
    }
  }
});

function MyApp({ Component, pageProps }) {
  const [title, setTitle] = useState("Lithium KB - Lithium Knowledge Base");
  const changeTitle = newTitle => {
    setTitle(newTitle);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://cdn.syncfusion.com/ej2/material.css"
          rel="stylesheet"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3500}
        >
          <Component {...pageProps} changeTitle={changeTitle} />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};

export default withApollo(MyApp);
