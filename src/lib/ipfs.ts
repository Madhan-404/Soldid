import axios from 'axios';

// You should store these in environment variables
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
  }
}

export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

export function getIPFSUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

