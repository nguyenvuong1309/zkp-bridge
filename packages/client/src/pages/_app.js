import '@/styles/globals.css' 
import { Web3OnboardProvider, init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'


const shibuya = {
  id: '0x51',
  token: 'SBY',
  label: 'Shibuya Testnet',
  rpcUrl: `https://evm.shibuya.astar.network`
}
const chains = [shibuya]
const wallets = [injectedModule()]

const web3Onboard = init({
  wallets,
  chains,
  // appMetadata: {
  //   name: 'Web3-Onboard Demo',
  //   icon: '<svg>App Icon</svg>',
  //   description: 'A demo of Web3-Onboard.'
  // }
})


const App = ({ Component, pageProps }) => {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <Component {...pageProps} />
    </Web3OnboardProvider>
  )
}

export default App