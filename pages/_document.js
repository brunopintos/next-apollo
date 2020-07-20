import Document from "next/document";
import { ServerStyleSheets } from "@material-ui/styles";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const sheets = new ServerStyleSheets();

    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props =>
            sheet.collectStyles(sheets.collect(<App {...props} />))
        });
      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            {sheets.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }
}
