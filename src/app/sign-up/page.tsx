/* eslint-disable react/no-unescaped-entities */
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from '@/components/Navbar'
// import Link from 'next/link'
import { useState } from "react"
import { CaptchaModal } from "@/components/CaptchaModal"
import { LivenessModal } from "@/components/LivenessModal"
import { IdVerificationModal } from "@/components/IdVerificationModal"
import { MintNFTButton } from "@/components/MintNFTButton"
import { useMintNFT } from "@/components/MintNFT"

export default function SignupPage() {
  const [captchaOpen, setCaptchaOpen] = useState(false)
  const [livenessOpen, setLivenessOpen] = useState(false)
  const [idVerificationOpen, setIdVerificationOpen] = useState(false)
  
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [livenessVerified, setLivenessVerified] = useState(false)
  const [idVerified, setIdVerified] = useState(false)

  const allVerified = captchaVerified && livenessVerified && idVerified

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar/>
      <main className="flex-1 flex flex-col items-center text-center p-6">
        <h1 className="text-4xl font-bold mb-8">Verify Your Identity 🆔 </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-2">CAPTCHA 🤖</h3>
            <p className="text-sm mb-4">Verify You're Human. Solve a CAPTCHA challenge to confirm you're not a bot.</p>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              onClick={() => setCaptchaOpen(true)}
            >
              {captchaVerified ? "✓ Verified" : "Proceed"}
            </Button>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-2">LIVENESS CHECK 👀</h3>
            <p className="text-sm mb-4">Show You're Real. Record a quick video selfie to confirm you are a live individual.</p>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              onClick={() => setLivenessOpen(true)}
            >
              {livenessVerified ? "✓ Verified" : "Proceed"}
            </Button>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-2">ID VERIFICATION 🪪</h3>
            <p className="text-sm mb-4">Confirm Your Identity. Submit a government-issued photo ID along with a video selfie.</p>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              onClick={() => setIdVerificationOpen(true)}
            >
              {idVerified ? "✓ Verified" : "Proceed"}
            </Button>
          </Card>
        </div>
        {allVerified && (
          <div className="max-w-md mx-auto mt-8">
            <h2 className="text-4xl font-bold mb-8">Mint your Digital Pass ✅</h2>
            <MintNFTButton />
          </div>
        )}

        {!allVerified && (
          <div className="mt-8">
            <h2 className="text-4xl font-bold mb-8">Mint your Digital Pass ✅</h2>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 py-4"
              disabled={true}
            >
              Complete verification first
            </Button>
          </div>
        )}

        <div className="py-7">
          <p className="py-6"> <b>Got a CIVIC PASS KYC (SBT) already? </b></p>
          <p>Skip over to Sign-in :)</p>
        </div>
        
        <CaptchaModal 
          open={captchaOpen}
          onOpenChange={setCaptchaOpen}
          onSuccess={() => setCaptchaVerified(true)}
        />
        <LivenessModal 
          open={livenessOpen}
          onOpenChange={setLivenessOpen}
          onSuccess={() => setLivenessVerified(true)}
        />
        <IdVerificationModal 
          open={idVerificationOpen}
          onOpenChange={setIdVerificationOpen}
          onSuccess={() => setIdVerified(true)}
        />
      </main>
      
      <footer className="p-6 border-t bg-background text-center">
        <p>&copy; Soldid 2024. All rights reserved.</p>
      </footer>
    </div>
  )
}
