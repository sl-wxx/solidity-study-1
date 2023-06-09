import { Html, Head, Main, NextScript } from "next/document"

// used to override the default way Next.js used to render a page
// <Html>, <Head />, <Main /> and <NextScript /> are required
// for the page to be properly rendered.
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
