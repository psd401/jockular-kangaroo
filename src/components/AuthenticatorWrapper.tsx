'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'
import Image from 'next/image'

// Get the current hostname for dynamic redirect URLs
const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || 'http://localhost:3000'
}

const awsConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
  oauth: {
    domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    redirectSignIn: getRedirectUrl(),
    redirectSignOut: getRedirectUrl(),
    responseType: 'code'
  }
}

Amplify.configure(awsConfig)

const components = {
  Header() {
    return (
      <div className="flex justify-center p-4">
        <Image
          alt="PSD Logo"
          src="/logo.png"
          width={150}
          height={50}
          style={{ objectFit: 'contain' }}
        />
      </div>
    )
  }
}

export function AuthenticatorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator
      components={components}
      loginMechanisms={['email']}
      services={{
        validateCustomSignUp: async (formData) => {
          const email = formData.email as string
          if (!email.endsWith('@psd401.net')) {
            return {
              email: 'Email must be from psd401.net domain'
            }
          }
          return {}
        }
      }}
    >
      {({ signOut, user }) => children}
    </Authenticator>
  )
} 