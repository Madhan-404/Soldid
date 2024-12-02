"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { uploadToIPFS, uploadMetadataToIPFS } from "@/lib/ipfs"
import { Progress } from "@/components/ui/progress"

interface FileUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (cid: string, metadata: any) => void
}

export function FileUploadModal({ open, onOpenChange, onSuccess }: FileUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setUploading(true)
      setProgress(20)

      // Upload file to IPFS
      const fileCid = await uploadToIPFS(file)
      setProgress(60)

      // Create and upload metadata
      const metadata = {
        title,
        description,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        timestamp: new Date().toISOString(),
        fileCid,
      }

      const metadataCid = await uploadMetadataToIPFS(metadata)
      setProgress(100)

      toast({
        title: "Upload successful!",
        description: "Your file has been uploaded to IPFS",
      })

      onSuccess(metadataCid, metadata)
      onOpenChange(false)

      // Reset form
      setFile(null)
      setTitle("")
      setDescription("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your file",
      })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a file to IPFS and store its reference on Solana.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpload}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="col-span-3"
                required
              />
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  Uploading... {progress}%
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={uploading || !file}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}