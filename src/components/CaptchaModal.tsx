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

interface CaptchaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CaptchaModal({ open, onOpenChange, onSuccess }: CaptchaModalProps) {
  const [userAnswer, setUserAnswer] = useState("")
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 })

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10)
    const num2 = Math.floor(Math.random() * 10)
    setCaptcha({ num1, num2, answer: num1 + num2 })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parseInt(userAnswer) === captcha.answer) {
      onSuccess()
      onOpenChange(false)
    } else {
      setUserAnswer("")
      generateCaptcha()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solve Captcha</DialogTitle>
          <DialogDescription>
            Please solve this simple math problem to proceed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="captcha" className="text-right col-span-2">
                {captcha.num1} + {captcha.num2} =
              </Label>
              <Input
                id="captcha"
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="col-span-2"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 