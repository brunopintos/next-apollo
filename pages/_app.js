import { withApollo } from "../lib/apollo";
import { SnackbarProvider } from "notistack";

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={3500}
    >
      <Component {...pageProps} />
    </SnackbarProvider>
  );
}

export default withApollo(MyApp);
