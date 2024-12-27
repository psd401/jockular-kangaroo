'use client'

import { useAuthenticator } from '@aws-amplify/ui-react'

export function SignOutButton() {
  const { signOut } = useAuthenticator()
  return (
    <button
      onClick={signOut}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
    >
      Sign Out
    </button>
  )
} 