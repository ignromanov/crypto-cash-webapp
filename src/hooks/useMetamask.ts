import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

export const useMetamask = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    }

    const connectMetamask = async () => {
      const ethereumProvider = await detectEthereumProvider({mustBeMetaMask: true,});
      if (ethereumProvider) {
        const web3Provider = new ethers.BrowserProvider(ethereumProvider as any);
        setProvider(web3Provider);
        // @ts-ignore
        const accounts = await ethereumProvider.request({ method: 'eth_accounts' })
        await handleAccountsChanged(accounts)

        ethereumProvider.on('accountsChanged', handleAccountsChanged);
      }
    };

    connectMetamask();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { provider, account };
};
