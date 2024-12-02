"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface NFTPreviewProps {
  metadata: {
    name: string
    symbol: string
    description: string
    image: string
    attributes: Array<{
      trait_type: string
      value: string
    }>
  }
}

export function NFTPreview({ metadata }: NFTPreviewProps) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>{metadata.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
          <Image
            src={metadata.image}
            alt={metadata.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{metadata.description}</p>
          <div className="grid grid-cols-2 gap-2">
            {metadata.attributes.map((attr, index) => (
              <div key={index} className="bg-muted p-2 rounded-md">
                <p className="text-xs font-medium">{attr.trait_type}</p>
                <p className="text-sm">{attr.value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 