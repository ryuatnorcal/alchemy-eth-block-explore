import { Alchemy, Network,AlchemySubscription  } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);


// // Streaming pending transactions
// alchemy.ws.on(
//   {
//     method: AlchemySubscription.PENDING_TRANSACTIONS
//   },
//   res => console.log(res)
// );

alchemy.ws.once(
  {
    method: AlchemySubscription.PENDING_TRANSACTIONS,
    toAddress: 'vitalik.eth'
  },
  res => console.log(res)
);

alchemy.ws.removeAllListeners();
function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState()
  const [transactions, setTransactions] = useState()
  const [recipts, setRecipt ] = useState()
  const [nft, setNft] = useState()

  // finding NFTs

  useEffect(() => {
    async function getNft() {
      if (!nft) {
        alchemy.nft.getNftsForOwner('vitalik.eth').then((result) => setNft(result));
      }
    }
    getNft()
  },[nft])
  
  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
    
  });
  useEffect(() => { 
    async function getBlock() {
      try {
        if (blockNumber) {
          setBlock(await alchemy.core.getBlock(blockNumber));
        }
      }catch (error) {
        console.log(error)
      }
    }
    getBlock()
  }, [blockNumber])
  
  useEffect(() => {
    async function getTransactions() {
      try {
        if (blockNumber) {
          setTransactions(await alchemy.core.getBlockWithTransactions(blockNumber));
        }
      } catch (error) {
        console.log(error)
      }
    }
    getTransactions()
  },[blockNumber])

  useEffect(() => { 
    async function getRecipt() {
      try {
        if (transactions) {
          // setRecipt(await alchemy.core.getTransactionReceipt());
        }
      } catch (error) {
        console.log(error)
      }
    }
    getRecipt()
  })

  const onClick = async (hash) => {
    setRecipt(await alchemy.core.getTransactionReceipt(hash));
  }


  return (
    <div className="App container">
      <div className="mb-4 text-blue-500">Block Number: {blockNumber}</div>
      {/* <div>Block: {JSON.stringify(block)}</div>
      <div>Transactions: {JSON.stringify(transactions)}</div> */}
      <div>
        <p>NFT</p>
        {nft && nft.ownedNfts?.map((n, index) => {
          return n.media[0]?.thumbnail&&(
            <div key={index}>
              <p>{n.title}</p>
              <img src={n.media[0]?.thumbnail} alt={n.title} width={350} height={350} />
            </div>
          )
        })}
      </div>
      <div className='m-4 border'>
        <div>setRecipt: {recipts && recipts.logs.map((l,i) => {
          return (
            <div key={i} className='text-left border m-4'>
              <p>Block Number: {JSON.stringify(l.blockNumber)}</p>
              <p>Block Hash: {JSON.stringify(l.blockHash)}</p>
            </div>
          )
        })}</div>
      </div>
      <div className='m-4'>{
        transactions && transactions.transactions.map((transaction, index) => {
          return (
            <div key={index} className='mb-4 border' onClick={()=>onClick(transaction.hash) }>
              <div>Hash: {transaction.hash}</div>
              <div>nounce: {transaction.nonce}</div>
            </div>
          )
        })
      }</div>
      
    </div>
    
  );
}

export default App;
