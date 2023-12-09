import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
const ReadData = ({ web3State,reload }) => {
  const [value, setValue] = useState("Not available");
  const { contract } = web3State;

  useEffect(() => {
    const viewValue = async () => {
      try {
        if (contract) {
          const bigNumberValue = await contract.methods.retrieve().call();
          const numValue = Number(bigNumberValue);
          setValue(numValue);
        }
      } catch (error) {
        console.error('Error while retrieving data:', error);
        toast.error("You need to login first!")
      }
    };

    viewValue();
  }, [contract,reload]);

  return (
    <div>
      <p>Stored Data: {value}</p>
    </div>
  );
};

export default ReadData;
