export const tokenNameMapping: { [key: string]: string } = {
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'BONK',
  'So11111111111111111111111111111111111111112': 'SOL',
  'TENSoLbpY8GVDSqNZ5tDWv5ZPqkMgkYMXgoimkHsakX': 'TNSR',
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': 'JUP'
};

export const getTokenName = (mintAddress: string): string => {
  return tokenNameMapping[mintAddress] || 'Unknown';
};
