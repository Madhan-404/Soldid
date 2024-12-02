import axios from 'axios';

export const getTokenName = async (mintAddress: string): Promise<string | null> => {
  try {
    console.log(`Fetching token name for mint address: ${mintAddress}`);
    const url = `https://mainnet.helius-rpc.com/?api-key=24084da3-e262-4410-9a02-774ee04b1f22`;

    const response = await axios.post(url, {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAsset',
      params: {
        id: mintAddress,
        displayOptions: {
          showFungible: true,
        },
      },
    });

    console.log('API response:', response.data);
    const { result } = response.data;
    const tokenSymbol = result?.token_info?.symbol;
    console.log(`Token symbol for ${mintAddress}: ${tokenSymbol}`);
    return tokenSymbol;
  } catch (error) {
    console.error('Error fetching token name:', error);
    return null;
  }
};
