
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletDashboard from './WalletDashboard';
import SPLTokenList from '../SPLTokenList';
import SendTransaction from '../SendTransaction';

const Dashboard = () => {
  const { publicKey, sendTransaction } = useWallet();

  return (
    <div>
      <h1>Solana Wallet Dashboard</h1>
      <WalletMultiButton />
      {publicKey && (
        <>
          <WalletDashboard publicKey={publicKey} />
          <SPLTokenList publicKey={publicKey} />
          <SendTransaction sendTransaction={sendTransaction} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
