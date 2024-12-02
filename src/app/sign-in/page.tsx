"use client"

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from '@/components/Navbar'
import { useState } from 'react'
import bs58 from 'bs58'

export default function SignInPage() {
  const { wallet, connected, signMessage } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = async () => {
    if (!connected || !signMessage || !wallet?.adapter?.publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet first"
      })
      return
    }

    try {
      setIsSigningIn(true)
      const message = new TextEncoder().encode(
        `Sign in to Soldid\nTimestamp: ${Date.now()}`
      )
      
      const signature = await signMessage(message)
      const signatureStr = bs58.encode(signature)

      // Here you would typically verify the signature on your backend
      // For now, we'll simulate a successful verification
      
      toast({
        title: "Successfully signed in!✅",
        description: (
          <>
            Signature: <a 
              href={`https://explorer.solana.com/tx/${signatureStr}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-blue-500 hover:text-blue-600"
            >
              {signatureStr}
            </a>
          </>
        )
      })

      router.push('/dashboard')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "Failed to sign the message. Please try again."
      })
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-6 space-y-6 text-center">
          <h1 className="text-3xl font-bold">Welcome to Soldid</h1>
          
          {!connected ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Connect your wallet to continue
              </p>
              <div className="flex justify-center">
                <WalletMultiButton />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Sign with your wallet to access your dashboard
              </p>
              <Button 
                onClick={handleSignIn} 
                disabled={isSigningIn}
                className="w-full"
              >
                {isSigningIn ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
