/* eslint-disable react/no-unescaped-entities */
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LivenessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function LivenessModal({ open, onOpenChange, onSuccess }: LivenessModalProps) {
  // Add actual liveness check logic here
  const handleComplete = () => {
    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Liveness Check</DialogTitle>
          <DialogDescription>
            Record a quick video selfie to verify you're a real person.
          </DialogDescription>
        </DialogHeader>
        {/* Add your liveness check UI components here */}
        <DialogFooter>
          <Button onClick={handleComplete}>Complete Check</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 