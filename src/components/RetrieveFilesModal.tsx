"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getIPFSUrl } from "@/lib/ipfs"
import { Program, AnchorProvider } from "@project-serum/anchor"
import { useWallet } from '@solana/wallet-adapter-react'
import { LoadingState } from "@/components/LoadingState"

interface FileMetadata {
  title: string
  description: string
  fileName: string
  fileType: string
  fileSize: number
  timestamp: string
  fileCid: string
}

interface RetrieveFilesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  program?: Program
}

export function RetrieveFilesModal({ open, onOpenChange, program }: RetrieveFilesModalProps) {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadFiles()
    }
  }, [open, connected, publicKey])

  const loadFiles = async () => {
    setLoading(true)
    try {
      let filesData: FileMetadata[] = []

      if (program && connected && publicKey) {
        // Fetch from Solana if program is available
        const accounts = await program.account.metadata.all([
          {
            memcmp: {
              offset: 8, // After discriminator
              bytes: publicKey.toBase58()
            }
          }
        ])

        filesData = accounts.map(account => ({
          ...account.account.metadata
        }))
      } else {
        // Fallback to localStorage
        const storedFiles = localStorage.getItem('uploadedFiles')
        if (storedFiles) {
          filesData = JSON.parse(storedFiles)
        }
      }

      setFiles(filesData)
    } catch (error) {
      console.error('Error loading files:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load files. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
    return Math.round((bytes / Math.pow(1024, i))) + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Uploaded Files</DialogTitle>
        </DialogHeader>

        {loading ? (
          <LoadingState />
        ) : files.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {files.map((file, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{file.title}</CardTitle>
                  <CardDescription>
                    {file.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>File:</strong> {file.fileName}</p>
                    <p><strong>Type:</strong> {file.fileType}</p>
                    <p><strong>Size:</strong> {formatFileSize(file.fileSize)}</p>
                    <p><strong>Uploaded:</strong> {formatDate(file.timestamp)}</p>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => window.open(getIPFSUrl(file.fileCid), '_blank')}
                    >
                      View File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 