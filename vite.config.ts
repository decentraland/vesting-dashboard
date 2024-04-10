// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import react from '@vitejs/plugin-react-swc'
// import rollupNodePolyFill from 'rollup-plugin-polyfill-node'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const envVariables = loadEnv(mode, process.cwd())
  const buildOptions = {
    base: envVariables.VITE_BASE_URL,
  }

  return {
    plugins: [react(), nodePolyfills()],
    build: {
      outDir: 'build',
    },
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
    ...(command === 'build' ? buildOptions : undefined),
  }
})
