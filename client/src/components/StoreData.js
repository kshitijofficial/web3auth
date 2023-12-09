import { useRef } from 'react';
import toast from 'react-hot-toast';
import './StoreData.css';
const StoreData = ({ web3State,setReload,reload }) => {
  const { contract, connectedAccount} = web3State;
  const numRef = useRef();

  const storeValue = async (e) => {
    e.preventDefault();
    try {
      if (!contract || !connectedAccount) {
        throw new Error("Contract instance or connected account are not available");
      }

      const inputNum = numRef.current.value.trim();
      if (!inputNum || isNaN(inputNum)) {
        console.log('Please provide a valid number.');
        return;
      }
      //const transaction = await contract.methods.store(inputNum).send({ from: connectedAccount });
      await toast.promise(contract.methods.store(inputNum).send({ from: connectedAccount }),
      {
        loading: "Transaction is pending...",
        success: 'Transaction successful 👌',
        error: 'Transaction failed 🤯'
      });
      numRef.current.value = ''; // Clear input after successful storage
      setReload(!reload)
    } catch (error) {
      console.error('Error while storing value:', error);
      toast.error("Error while storing value!")
    }
  };

  return (
    <div className="store-data-container "> {/* Apply a class for container styling */}
      <form onSubmit={storeValue}>
        <div className="input-field"> {/* Apply a class for label and input styling */}
          <label htmlFor="inputData">Input Data:</label>
          <input type="text" id="inputData" ref={numRef}  />
        </div>
        <button type="submit" className='store-btn'>Store Value</button>
      </form>
    </div>
  );
};

export default StoreData;
