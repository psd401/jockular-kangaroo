'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'
import Image from 'next/image'
import { ReactElement } from 'react'

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

export function AuthenticatorWrapper({ children }: { children: ReactElement }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-[400px] flex flex-col items-center gap-12">
        <div className="w-full flex justify-center">
          <Image
            alt="Kangaroo"
            src="/kangaroo.jpg"
            width={200}
            height={200}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        
        <div className="w-full flex justify-center">
          <h1 className="text-3xl font-bold text-gray-800">
            PSD Intervention Tracking
          </h1>
        </div>
        
        <Authenticator
          loginMechanisms={['email']}
          services={{
            async validateCustomSignUp(formData) {
              const email = formData.email?.toString() || ''
              if (!email.endsWith('@psd401.net')) {
                throw new Error('Email must be from psd401.net domain')
              }
              return undefined
            }
          }}
        >
          {({ signOut, user }) => children}
        </Authenticator>
        
        <div className="w-full flex justify-center mt-8">
          <Image
            alt="PSD Logo"
            src="/logo.png"
            width={300}
            height={100}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  )
} 