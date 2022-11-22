import React from 'react'
import Head from 'next/head'

import type { AppProps } from 'next/app'
import Cssbaseline from '@mui/material/CssBaseline'

import { MediaStreamProvider } from 'context/MediaStream'
import { MediaScreenStreamProvider } from 'context/ScreenStream'
import { SocketProvider } from 'context/SocketContext'
import { FirebaseProvider } from 'context/FirebaseContext'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps | any) {
  return (
    <FirebaseProvider>
      <SocketProvider>
        <MediaScreenStreamProvider>
          <MediaStreamProvider>
            <Cssbaseline />
            <Head>
              <title>ConnectMeP2P</title>
              <link
                rel="icon"
                href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>"
              />
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
              />
            </Head>
            <Component {...pageProps} />
          </MediaStreamProvider>
        </MediaScreenStreamProvider>
      </SocketProvider>
    </FirebaseProvider>
  )
}

export default MyApp
