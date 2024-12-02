"use client"

import WalletButton from "@/components/WalletButton"
import { MoonIcon, SunIcon, Briefcase, SearchIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { useNetworkState } from '@/hooks/useNetworkState'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { LogOut } from "lucide-react"
import { useState } from 'react'
import { Input } from "@/components/ui/input"

export default function Navbar({ onSearch }: { onSearch: (term: string) => void }) {
  const { theme, setTheme } = useTheme()
  const { network, setNetwork } = useNetworkState()
  const { connected, disconnect, publicKey } = useWallet()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const handleNetworkChange = (newNetwork: WalletAdapterNetwork) => {
    setNetwork(newNetwork)
  }

  const handlePortfolioClick = () => {
    router.push('/sign-in')
  }

  const handleDisconnect = () => {
    if (connected && publicKey) {
      console.log('Disconnecting wallet:', publicKey.toBase58())
      disconnect()
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <nav className="h-[8vh] flex items-center justify-between px-6 border-b bg-background relative overflow-hidden group">
      <Link href="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
        {/* <SquirrelIcon className="h-6 w-6" /> */}
        <h1 className="text-xl font-bold">Soldid🔐</h1>
      </Link>

      <form onSubmit={handleSearch} className="flex-1 flex justify-center relative">
        <Input
          className="mx-4 pl-10"
          placeholder=""
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" variant="ghost" size="icon" className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </form>
        <WalletButton />
      <div className=" flex items-center space-x-4 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {network === WalletAdapterNetwork.Mainnet ? 'Mainnet' : 'Devnet'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleNetworkChange(WalletAdapterNetwork.Mainnet)}>
              Mainnet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNetworkChange(WalletAdapterNetwork.Devnet)}>
              Devnet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handlePortfolioClick}
        >
          <Briefcase className="h-5 w-5" />
        </Button>

        {connected && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDisconnect}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </nav>
  )
}