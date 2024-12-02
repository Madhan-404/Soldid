import BN from 'bn.js';
import { StreamflowSolana, StreamType, StreamDirection, IGetAllData, ITransferData, ICancelData , ITransactionResult} from "@streamflow/stream";
import { Keypair } from '@solana/web3.js';

export const getNumberFromBN = (bn: BN, decimals: number): number => {
  return bn.div(new BN(10).pow(new BN(decimals))).toNumber() + 
         bn.mod(new BN(10).pow(new BN(decimals))).toNumber() / Math.pow(10, decimals);
};

export const formatAmount = (amount: string, decimals: number): string => {
  const bn = new BN(amount);
  return getNumberFromBN(bn, decimals).toFixed(2);
};

export interface ParsedStream {
  id: string;
  name: string;
  createdAt: Date;
  start: Date;
  end: Date;
  depositedAmount: string;
  withdrawnAmount: string;
  remainingAmount: string;
  sender: string;
  recipient: string;
  mint: string;
  cliffAmount: string;
  cancelableBySender: boolean;
  cancelableByRecipient: boolean;
  transferableBySender: boolean;
  transferableByRecipient: boolean;
  automaticWithdrawal: boolean;
  streamType: string;
}

export const parseStreamData = (streamData: [string, any][]): ParsedStream[] => {
  return streamData.map(([id, stream]) => {
    const depositedAmount = formatAmount(stream.depositedAmount, 9); // Assuming 9 decimals for SOL
    const withdrawnAmount = formatAmount(stream.withdrawnAmount, 9);
    const remainingAmount = formatAmount(
      new BN(stream.depositedAmount).sub(new BN(stream.withdrawnAmount)).toString(),
      9
    );

    return {
      id,
      name: stream.name.replace(/\0/g, '').trim(),
      createdAt: new Date(stream.createdAt * 1000),
      start: new Date(stream.start * 1000),
      end: new Date(stream.end * 1000),
      depositedAmount,
      withdrawnAmount,
      remainingAmount,
      sender: stream.sender,
      recipient: stream.recipient,
      mint: stream.mint,
      cliffAmount: formatAmount(stream.cliffAmount, 9),
      cancelableBySender: stream.cancelableBySender,
      cancelableByRecipient: stream.cancelableByRecipient,
      transferableBySender: stream.transferableBySender,
      transferableByRecipient: stream.transferableByRecipient,
      automaticWithdrawal: stream.automaticWithdrawal,
      streamType: stream.type,
    };
  });
};

export const getMultipleStreams = async (client: StreamflowSolana.SolanaStreamClient, address: string): Promise<ParsedStream[]> => {
  const data: IGetAllData = {
    address,
    type: StreamType.All,
    direction: StreamDirection.All,
  };

  try {
    const streams = await client.get(data);
    return parseStreamData(streams);
  } catch (exception) {
    console.error('Error fetching multiple streams:', exception);
    throw exception;
  }
};


export const transferStream = async (
  client: StreamflowSolana.SolanaStreamClient,
  streamId: string,
  newRecipient: string,
  keypair: Keypair
) => {

  try {
    const stream = await client.getOne({ id: streamId });

    if (stream.closed) {
      throw new Error("This stream is already closed");
    }

    if (stream.withdrawnAmount.eq(stream.depositedAmount)) {
      throw new Error("This stream has been fully withdrawn");
    }

    if (!stream.transferableBySender) {
      throw new Error("This stream is not transferable by the sender");
    }

    if (stream.sender !== keypair.publicKey.toBase58()) {
      throw new Error("You are not the sender of this stream");
    }

    const transferData: ITransferData = {
      id: streamId,
      newRecipient: newRecipient
    };

    const solanaParams = {
      invoker: keypair
    };

    const { ixs, txId } = await client.transfer(transferData, solanaParams);
    return { ixs, txId };
  } catch (error) {
    throw error;
  }
};

export const cancelStream = async (
  client: StreamflowSolana.SolanaStreamClient,
  streamId: string,
  keypair: Keypair
) => {
  try {
    const cancelStreamParams: ICancelData = {
      id: streamId,
    };

    const solanaParams = {
      invoker: keypair
    };

    const { ixs, txId }: ITransactionResult = await client.cancel(cancelStreamParams, solanaParams);
    return { ixs, txId };
  } catch (error) {
    console.error('Error canceling stream:', error);
    throw error;
  }
};

