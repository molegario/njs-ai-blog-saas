import Document, { Html, Head, Main, NextScript } from "next/document";
// import { UserProvider } from '@auth0/nextjs-auth0/client'

class MyDocument extends Document {
  render() {


    return (
      <Html lang='en'>
        <Head />
          <body>
            <div id="overlays"></div>
            <Main />
            <NextScript />
          </body>
      </Html>
    );
  }
}

export default MyDocument;