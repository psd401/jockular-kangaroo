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

const LoginHeader = () => (
  <div className="flex justify-center mb-6">
    <h1 className="text-xl font-semibold text-gray-800">
      PSD Intervention Tracking
    </h1>
  </div>
)

const LoginFooter = () => null

export function AuthenticatorWrapper({ children }: { children: ReactElement }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm p-8 w-[360px]">
        <Authenticator
          components={{
            Header: LoginHeader,
            Footer: LoginFooter
          }}
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
          hideSignUp={true}
        >
          {({ signOut, user }) => children}
        </Authenticator>
      </div>
    </div>
  )
} 