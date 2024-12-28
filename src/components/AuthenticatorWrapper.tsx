'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'
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
  <div className="flex justify-center mb-4">
    <h1 className="text-2xl font-semibold text-[#31424C]">
      PSD Intervention Tracking
    </h1>
  </div>
)

const LoginFooter = () => null

export function AuthenticatorWrapper({ children }: { children: ReactElement }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#D7CDBE]">
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
      <style jsx global>{`
        .amplify-authenticator {
          background: white;
          border: none;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          border-radius: 0.5rem;
          width: 360px;
          padding: 2rem;
        }
        .amplify-button[data-variation='primary'] {
          background: #4A6F86;
        }
        .amplify-button[data-variation='primary']:hover {
          background: #5C8299;
        }
        .amplify-field__show-password {
          color: #4A6F86;
        }
      `}</style>
    </div>
  )
} 