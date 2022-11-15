import store from '../store';
import { Provider } from 'react-redux';
import { chain, createClient, configureChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from '../components/header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { provider, webSocketProvider, chains } = configureChains(
  [chain.polygonMumbai], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: 'Snowmen',
  chains,
});

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  // added connectors from rainbowkit
  connectors,
});

// added RainbowKitProvider wrapper
function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <Provider store={store}>
          <Header></Header>
          <ToastContainer />
          <Component {...pageProps} />
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;