'use client';

import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from "../../idl/idl.json";

const programId = new PublicKey("BqF5nMEPyJP3tEWcReJyW6me4fVnS1Bb8qxeJyVrYaMK");

const connection = new Connection("https://api.devnet.solana.com", "processed");

const provider = AnchorProvider.env();
const wallet = provider.wallet;

// Initialize the program
const program = new Program(idl, programId, provider);

export async function createMetadata(cid: string, timestamp: string) {
    const [metadataAccount] = await PublicKey.findProgramAddressSync(
      [Buffer.from(cid), wallet.publicKey.toBuffer()],
      program.programId
    );
  
    await program.methods
      .createMetadata(cid, timestamp)
      .accounts({
        metadataAccount,
        owner: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  }

