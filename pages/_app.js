import React, { useState } from "react";
import { withApollo } from "../lib/apollo";
import { SnackbarProvider } from "notistack";
import Head from "next/head";
import { yellow, grey } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: yellow["A700"]
    },
    secondary: {
      main: grey[800]
    }
  }
});

function MyApp({ Component, pageProps }) {
  const [title, setTitle] = useState("LKB - Lithium Knowledge Base");
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
          <DndProvider backend={Backend}>
            <Component {...pageProps} changeTitle={changeTitle} />
          </DndProvider>
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
