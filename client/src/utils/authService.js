import { Web3AuthNoModal } from '@web3auth/no-modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { clientId, chainConfig } from '../config/config';

const initializeWeb3Auth = () => {
  try{
    const web3authInstance = new Web3AuthNoModal({
      clientId,
      web3AuthNetwork: 'sapphire_devnet',
      chainConfig,
    });
  
    const privateKeyProvider = new EthereumPrivateKeyProvider({
      config: { chainConfig },
    });
  
    // const openloginAdapter = new OpenloginAdapter({
    //   privateKeyProvider,
    // });

    const openloginAdapter = new OpenloginAdapter({
      privateKeyProvider,
      adapterSettings: {
        // uxMode: "redirect",
        loginConfig: {
          jwt: {
            verifier: "testing_phase", // Pass the Verifier name here
            typeOfLogin: "jwt", // Pass on the login provider of the verifier you've created
            clientId: "YelFk2BtwOaZIssG9rSPs0N3mAsv9XxO", // Pass on the Auth0 `Client ID` here
          },
        },
      },
    });
    
    web3authInstance.configureAdapter(openloginAdapter);
    return web3authInstance;
  }catch(error){
    console.error('Error initializing Web3Auth:', error);
    return null;
  }
};

export default initializeWeb3Auth;
