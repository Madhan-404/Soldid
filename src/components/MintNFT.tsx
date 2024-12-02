"use client"

import { useWallet } from '@solana/wallet-adapter-react'
import { useMetaplex } from "@/hooks/useMetaplex"
import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { uploadToIPFS, uploadMetadataToIPFS, getIPFSUrl } from "@/lib/ipfs"

const createNFTMetadata = (imageUri: string) => ({
  name: "Soldid Identity Pass",
  symbol: "SOLDID",
  description: "This NFT represents your verified identity on Soldid",
  image: imageUri,
  attributes: [
    {
      trait_type: "Verification Level",
      value: "Complete"
    },
    {
      trait_type: "Type",
      value: "Identity Pass"
    }
  ]
})

export function useMintNFT() {
  const [isMinting, setIsMinting] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { metaplex } = useMetaplex()
  const { publicKey } = useWallet()
  const { toast } = useToast()

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files && event.target.files[0]) {
        const uploadedImage = event.target.files[0]
        
        // Validate file size (e.g., max 5MB)
        if (uploadedImage.size > 5 * 1024 * 1024) {
          throw new Error("File size too large. Maximum size is 5MB");
        }

        // Validate file type
        if (!uploadedImage.type.startsWith('image/')) {
          throw new Error("Please upload an image file");
        }

        setImage(uploadedImage)
        setImagePreview(URL.createObjectURL(uploadedImage))
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload image"
      })
    }
  }

  const mintNFT = async () => {
    if (!publicKey || !metaplex || !image) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet and upload an image first"
      })
      return
    }

    try {
      setIsMinting(true)
      
      toast({
        title: "Starting mint process",
        description: "Please wait while we upload your image..."
      })

      const imageCid = await uploadToIPFS(image)
      const imageUri = getIPFSUrl(imageCid)
      
      toast({
        title: "Image uploaded",
        description: "Creating NFT metadata..."
      })

      const metadata = createNFTMetadata(imageUri)
      const metadataCid = await uploadMetadataToIPFS(metadata)
      const metadataUri = getIPFSUrl(metadataCid)

      toast({
        title: "Minting NFT",
        description: "Please approve the transaction in your wallet..."
      })

      const { nft } = await metaplex.nfts().create({
        uri: metadataUri,
        name: metadata.name,
        sellerFeeBasisPoints: 0,
        symbol: metadata.symbol,
      })

      toast({
        title: "Success!",
        description: (
          <div className="mt-2">
            <p>Your Identity Pass NFT has been minted!</p>
            <a 
              href={`https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline mt-2 inline-block"
            >
              View on Solana Explorer
            </a>
          </div>
        )
      })

      return nft.address.toString()
    } catch (error) {
      console.error('Minting error:', error)
      toast({
        variant: "destructive",
        title: "Minting failed",
        description: error instanceof Error ? error.message : "Failed to mint NFT"
      })
      throw error
    } finally {
      setIsMinting(false)
    }
  }

  return { mintNFT, isMinting, uploadImage, imagePreview }
} 