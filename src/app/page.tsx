"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import Link from 'next/link'
import { LockKeyholeIcon } from "lucide-react"

export default function LandingPage() {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar/>
      <main className="flex-1 flex flex-col items-center text-center p-6">
        <h2 className="text-4xl font-bold mb-4 py-5 px-9">Secure Your Identity & Credentials on Solana</h2>
        
        <div className="text-lg mb-8 space-y-4">
        <p> We Leveraged </p>
          <p><b>Civic DIDs 🔑</b>: Uses ZKPs to ensure privacy and security</p>
          <p><b>Underdog 🐶</b>: Minting c-NFTs (for the passes)</p>
          <p><b>Helius ⚡</b>: Provides reliable RPC services</p>  
        </div>


        
        <div className="flex space-x-4 mb-8 py-3">
          <Link href="/sign-up">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Sign Up </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline">Sign in</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-2">Decentralized Identity</h3>
            <p className="text-sm">Your identity is stored securely on the blockchain, ensuring privacy and security.</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-2">Credential Management</h3>
            <p className="text-sm">Easily manage and share your credentials with trusted parties.</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-2">KYC Compliance</h3>
            <p className="text-sm">Streamline your KYC processes with blockchain-based identity verification.</p>
          </Card>
        </div>
        <div className="mt-8 text-stone-100 text-xl">
        {/* <Image src="/assets/safe.png" alt="Safe" width={600} height={400} className="mb-8 rounded-lg shadow-lg" /> */}
        
        </div>
      </main>
      <footer className="p-6 border-t bg-background text-center">
        <p>&copy; Soldid 2024. All rights reserved.</p>
      </footer>
    </div>
  )
}
