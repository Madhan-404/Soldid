import React from 'react';
import { Connection } from '@solana/web3.js';
import { GatewayProvider,SolanaWalletAdapter } from "@civic/solana-gateway-react";
import { AnchorProvider, Wallet } from '@project-serum/anchor';

export const Civicgateway = () => {

    const 
  return (
  <GatewayProvider
  connection= new Connection( "https://api.devnet.solana.com", "processed")
  wallet={Wallet}
  gatekeeperNetwork={gatekeeperNetwork}>
  {children}
</GatewayProvider>
  )
}

