"use client"

import { Metaplex } from "@metaplex-foundation/js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useMemo } from "react"

export const useMetaplex = () => {
  const { connection } = useConnection()
  const wallet = useWallet()

  const metaplex = useMemo(
    () => {
      if (!connection || !wallet) return null
      return Metaplex
    },
    [connection, wallet]
  )

  return { metaplex }
} 
