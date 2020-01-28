import { withApollo } from "../lib/apollo";
import { SnackbarProvider } from "notistack";

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={2000}
    >
      <Component {...pageProps} />
    </SnackbarProvider>
  );
}

export default withApollo(MyApp);
