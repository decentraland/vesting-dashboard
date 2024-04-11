import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const envVariables = loadEnv(mode, process.cwd())
  const buildOptions = {
    base: envVariables.VITE_BASE_URL,
  }
  const isBuildCommand = command === 'build'

  return {
    plugins: [react(), isBuildCommand ? nodePolyfills() : undefined],
    // Required because the CatalystClient tries to access it
    define: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'process.env': {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        VITE_REACT_APP_DCL_DEFAULT_ENV: envVariables.VITE_REACT_APP_DCL_DEFAULT_ENV,
      },
    },
    server: {
      proxy: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '/auth': {
          target: 'https://decentraland.zone',
          followRedirects: true,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    ...(isBuildCommand ? buildOptions : undefined),
  }
})
