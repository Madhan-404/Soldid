"use client"

import { Button } from "@/components/ui/button"
import { useMintNFT } from "./MintNFT"
import Image from "next/image"
import { Card } from "./ui/card"

export function MintNFTButton() {
  const { mintNFT, isMinting, uploadImage, imagePreview } = useMintNFT()

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-6">
        {imagePreview ? (
          <div className="relative w-64 h-64">
            <Image 
              src={imagePreview} 
              alt="NFT Preview" 
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-sm text-gray-500">Upload an image for your NFT</p>
          </div>
        )}
        
        <input 
          type="file" 
          onChange={uploadImage} 
          accept="image/*"
          className="w-full max-w-xs"
          disabled={isMinting}
        />
        
        <Button
          onClick={mintNFT}
          disabled={isMinting || !imagePreview}
          className="w-full max-w-xs"
        >
          {isMinting ? "Minting..." : "Mint Identity Pass NFT"}
        </Button>
      </div>
    </Card>
  )
} 