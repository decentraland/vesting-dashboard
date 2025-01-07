import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { initStore } from './modules/store'
import App from './components/App'

import './index.css'
import 'decentraland-ui/lib/styles.css'
import { DclThemeProvider, lightTheme } from 'decentraland-ui2'

const queryClient = new QueryClient()
const basename = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/vesting' : '/'

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
        <Provider store={initStore()}>
          <WalletProvider>
            <TranslationProvider locales={['en']}>
              <DclThemeProvider theme={lightTheme}>
                <Routes>
                  <Route path="*" element={<App />} />
                </Routes>
              </DclThemeProvider>
            </TranslationProvider>
          </WalletProvider>
        </Provider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
