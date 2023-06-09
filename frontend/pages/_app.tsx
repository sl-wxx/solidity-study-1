import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "@web3uikit/core"

// used to override the default way Next.js initialize pages
// You can override it and control the page initialization and:
//    1. Persist layouts between page changes
//    2. Keeping state when navigating pages
//    3. Inject additional data into pages
//    4. Add global CSS

// The Component prop is the active page, so whenever you navigate between routes,
// Component will change to the new page

// pageProps is an object with the initial props that were preloaded for your page
// by one of our data fetching methods, otherwise it's an empty object.

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  )
}
