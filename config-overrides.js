const { override, babelInclude } = require('customize-cra')
const path = require('path')

module.exports = override(
  babelInclude([
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules/@walletconnect'),
    path.resolve(__dirname, 'node_modules/@web3modal'),
    path.resolve(__dirname, 'node_modules/@metamask/utils/node_modules/superstruct'),
  ])
)
