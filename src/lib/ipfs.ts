import axios from 'axios';

// Pinata API credentials
const pinataApiKey = "ed6ae9d999940ec7a728";
const pinataSecretApiKey = "cab0b1b6c0b904f2d6a2f5533a27f6a6e3e3b9af39a2ff5b993557329ec8d91f";

if (!pinataApiKey || !pinataSecretApiKey) {
  throw new Error('Pinata credentials not properly configured. Please set PINATA_API_KEY and PINATA_SECRET_API_KEY in your environment.');
}

// Function to upload files to IPFS
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });

    console.log('Upload successful. CID:', response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error: any) {
    console.error('Error uploading to IPFS:', error.message);
    throw new Error('Failed to upload to IPFS');
  }
}

// Function to construct a public IPFS URL
export function getIPFSUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

// Function to upload metadata to IPFS
export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  try {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    const response = await axios.post(url, metadata, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });

    console.log('Metadata upload successful. CID:', response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error: any) {
    console.error('Error uploading metadata to IPFS:', error.message);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

// Function to retrieve data from IPFS
export async function retrieveFromIPFS(cid: string): Promise<any> {
  try {
    const url = getIPFSUrl(cid);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch CID ${cid}. HTTP status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return await response.text(); // Fallback for non-JSON data
  } catch (error: any) {
    console.error('Error retrieving from IPFS:', error.message);
    throw new Error(`Failed to retrieve data from IPFS. CID: ${cid}`);
  }
}
