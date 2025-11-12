'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/app/libs/supabaseClient'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Fetch user on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  // Handle logout
const handleLogout = async () => {
  console.log('Logging out...') // 👈 debug
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Logout error:', error)
  else console.log('Signed out successfully')
  setUser(null)
  router.push('/auth/login')
}

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ArtConnect Pro
        </Link>

        <div className="space-x-4">
          {user ? (
            <>
             
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-900">
          Connect. Create. Inspire.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          A platform for artists to showcase their work, host events, and grow
          their creative community. Join ArtConnect Pro to explore, collaborate,
          and elevate your artistry.
        </p>

        <div className="space-x-4">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/events"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Explore Events
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why ArtConnect Pro?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-800">
            {[
              {
                title: 'Artist Profiles',
                desc: 'Create a stunning profile to showcase your bio, artworks, and social links.',
                icon: '🎨',
              },
              {
                title: 'Event Management',
                desc: 'Host and manage your own exhibitions or workshops easily.',
                icon: '📅',
              },
              {
                title: 'Secure Payments',
                desc: 'Accept event registrations and payments via Stripe safely.',
                icon: '💳',
              },
              {
                title: 'Admin Dashboard',
                desc: 'Track artists, events, and registrations from one place.',
                icon: '📊',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-md transition"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-xl mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        <p>© {new Date().getFullYear()} ArtConnect Pro</p>
      </footer>
    </main>
  )
}
