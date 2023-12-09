import { useState,useEffect } from 'react';
import { WALLET_ADAPTERS } from '@web3auth/base';
import initializeWeb3State from '../utils/Web3State';
import { serverAuthentication } from '../utils/responseHandler';
import StoreData from './StoreData';
import ViewData from './ViewData';
import "./Login.css"
import toast from 'react-hot-toast';

let web3authProvider=null;
const Login = ({ web3authInstance,setIsLoggedIn,isLoggedIn }) => {
  const [reload,setReload]=useState(false);
  const [web3State, setWeb3State] = useState({
    web3: null,
    contract: null,
    connectedAccount:"not connected",
  });
  const [balance,setBalance]=useState(0);

  const login = async () => {
    try {
      if (!web3authProvider) {
        // web3authProvider = await web3authInstance.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        //   loginProvider: 'linkedin',
        // });

        web3authProvider = await web3authInstance.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: "jwt",
          extraLoginOptions: {
            domain: "https://dev-yepqgoh1027lep8m.us.auth0.com", // Pass on the Auth0 `Domain` here
            verifierIdField: "sub", // Pass on the field name of the `sub` field in the JWT
            connection: "linkedin", // Use this to skip Auth0 Modal for LinkedIn login
          },
      
        });
        
        const data = await serverAuthentication(web3authInstance);
        if(data.name==='Verification Successful'){
          const { web3, contract, connectedAccount } = await initializeWeb3State(web3authProvider);
          const balanceObj = await web3.eth.getBalance(connectedAccount)
          const accountBalance=web3.utils.fromWei(balanceObj,"ether")
          const formattedBalance = parseFloat(accountBalance).toFixed(2);
          setIsLoggedIn(!isLoggedIn)
          setWeb3State({ web3, contract, connectedAccount });
          setBalance(formattedBalance)
          toast.success("Login Successful!")
        }else{
          throw new Error ("Server side authentication failed")
        }
      }
    } catch (error) {
      if(error.message.includes('Failed to login with openlogin')){
        toast.error("Login Failed!Check your internet connection")
        console.error('Error during login:', error);
      }else if(error.message.includes('Server side authentication failed')){
        toast.error("Login Failed!Authentication Failed")
        console.error('Error during login:', error);
      }else{
        toast.error("Login Failed!")
        console.error('Error during login:', error);
      }
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      web3authProvider = null; // Reset the provider if user is logged out
      setWeb3State({
        web3: null,
        contract: null,
        connectedAccount: "not connected",
      });
      setBalance(0)
    }
  }, [isLoggedIn]);

  return (
    <div>
        <div className="top-right">
          {!isLoggedIn &&  <button className="login-btn" onClick={login}>Login</button> }
          <p>Account: {web3State.connectedAccount}</p> 
          <p>Account Balance: {balance} Ether</p>
        </div>
        <div className='center'>
          {isLoggedIn && (
            <>
              <StoreData web3State={web3State} setReload={setReload} reload={reload} />
              <ViewData web3State={web3State} reload={reload}/>
            </>
          )}
          {!isLoggedIn && <p className='home-txt'>You need to login first!!!</p>}
        </div>
    </div>
  );
};

export default Login;
