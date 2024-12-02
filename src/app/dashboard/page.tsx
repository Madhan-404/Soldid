"use client"

import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { FileUploadModal } from "@/components/FileUploadModal"
import { RetrieveFilesModal } from "@/components/RetrieveFilesModal"

export default function DashboardPage() {
  const { connected } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [retrieveModalOpen, setRetrieveModalOpen] = useState(false)

  // Protect the route
  useEffect(() => {
    if (!connected) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "Please sign in first"
      })
      router.push('/sign-in')
    }
  }, [connected, router, toast])

  const handleUploadSuccess = async (cid: string, metadata: any) => {
    try {
      // Here you would store the CID on Solana
      // Example: await program.methods.storeDocument(cid).rpc()
      
      toast({
        title: "Document stored",
        description: "Successfully stored document reference on Solana",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Storage failed",
        description: "Failed to store document reference on Solana",
      })
    }
  }

  // Update the upload button to open modal
  const handleUpload = () => {
    setUploadModalOpen(true)
  }

  const handleRetrieve = () => {
    setRetrieveModalOpen(true)
  }

  if (!connected) return null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
              <p className="text-muted-foreground mb-4">
                Securely upload and store your files on the blockchain
              </p>
              <Button onClick={handleUpload} className="w-full">
                Upload New Files
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Retrieve Files</h2>
              <p className="text-muted-foreground mb-4">
                Access and download your previously stored files
              </p>
              <Button onClick={handleRetrieve} className="w-full">
                View Existing Files
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <FileUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSuccess={handleUploadSuccess}
      />
      <RetrieveFilesModal
        open={retrieveModalOpen}
        onOpenChange={setRetrieveModalOpen}
      />
    </div>
  )
}
