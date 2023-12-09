import { useEffect, useState } from 'react';
import initializeWeb3Auth from './utils/authService';
import Login from './components/Login';
import Logout from './components/Logout';

const App = () => {
 
  const [web3authInstance, setweb3authInstance] = useState(null);
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [logoutKey, setLogoutKey] = useState(false); // Key to useEffect reload
  useEffect(() => {
    const initWeb3Auth = async () => {
        try{
            const web3authInstance = initializeWeb3Auth()
            setweb3authInstance(web3authInstance)      
            // Initialize
            await web3authInstance.init(); 
        }catch(error){
          console.error(error)
        }
       
    }
    
    initWeb3Auth();
  }, [logoutKey]);

  return (
    <div>
       <Login web3authInstance={web3authInstance} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>
       <Logout web3authInstance={web3authInstance} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} logoutKey={logoutKey} setLogoutKey={setLogoutKey} /> 
    </div>
  );
};

export default App;
