"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation" 
import { Menu, X, User, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"
import Image from "next/image" // 1. Import komponen Image

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = Cookies.get("token")
    setIsLoggedIn(!!token)
  }, [pathname])

  const handleLogout = () => {
    Cookies.remove("token")
    setIsLoggedIn(false)
    router.push("/")
    router.refresh()
  }

  // Komponen untuk tombol Autentikasi
  const AuthButtons = ({ isMobile = false }: { isMobile?: boolean }) => {
    const closeMenu = () => isMobile && setIsMenuOpen(false)

    if (isLoggedIn) {
      return (
        <div className={`flex items-center ${isMobile ? 'flex-col space-y-4 pt-2' : 'space-x-2'}`}>
          <Link href="/bookmarks" onClick={closeMenu}>
            <Button variant="ghost" className="hover:bg-teal-50">
              <Bookmark className="h-5 w-5 md:mr-2" />
              <span className={isMobile ? '' : 'hidden md:inline'}>My Bookmarks</span>
            </Button>
          </Link>
          <Link href="/profile" onClick={closeMenu}>
            <Button variant="ghost" className="hover:bg-teal-50">
              <User className="h-5 w-5 md:mr-2" />
              <span className={isMobile ? '' : 'hidden md:inline'}>Profil</span>
            </Button>
          </Link>
          <Button
            onClick={() => {
              handleLogout()
              closeMenu()
            }}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 w-full md:w-auto"
          >
            Logout
          </Button>
        </div>
      )
    }

    return (
      <div className={`flex items-center ${isMobile ? 'space-x-4 pt-2' : 'space-x-8'}`}>
        <Link href="/auth/login" onClick={closeMenu}>
          <Button variant="outline" className="hover:border-indigo-500 hover:bg-indigo-100 hover:text-indigo-900 bg-[#1D2045] text-indigo-100 w-full rounded-lg">
            Login
          </Button>
        </Link>
        <Link href="/auth/signup" onClick={closeMenu}>
          <Button variant="outline" className="border-indigo-500 bg-indigo-100 text-indigo-900 hover:bg-[#1D2045] hover:text-indigo-100 w-full rounded-lg">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <header className="bg-ncmidnight border-b border-indigo-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* PERBAIKAN: Ganti div dengan komponen Image */}
            <div className="relative w-10 h-10 mr-2">
              <Image
                src="/logo.png" // Pastikan logo.png ada di folder /public
                alt="NextCourse Logo"
                fill // Mengisi div parent, membuatnya responsif
                style={{ objectFit: 'contain' }} // Menjaga aspek rasio gambar
              />
            </div>
            <span className="font-bold text-xl text-gray-200">NextCourse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-gray-200">
            <Link href="/" className="font-medium hover:text-sky-500 transition-colors">
              Home
            </Link>
            <Link href="/courses" className="font-medium hover:text-sky-500 transition-colors">
              Course
            </Link>
            <Link href="/about" className="font-medium hover:text-sky-500 transition-colors">
              About
            </Link>
            <AuthButtons />
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-gray-900" /> : <Menu className="h-6 w-6 text-gray-900" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-900 font-medium hover:text-teal-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/courses" className="text-gray-900 font-medium hover:text-teal-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Course
              </Link>
              <Link href="/about" className="text-gray-900 font-medium hover:text-teal-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <AuthButtons isMobile={true} />
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
