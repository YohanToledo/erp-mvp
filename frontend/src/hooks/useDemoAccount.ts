import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

import { env } from '@/env'

export interface JwtAdminPayload {
  subscriber?: string
  [key: string]: unknown
}

const useDemoAccount = () => {
  const [loading, setLoading] = useState(true)
  const [isDemoAccount, setIsDemoAccount] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(env.VITE_SESSION_KEY)

    if (token) {
      try {
        setLoading(true)

        const decodedToken = jwtDecode<JwtAdminPayload>(token)

        // Demo account subscriber ID
        setIsDemoAccount(
          decodedToken?.subscriber === '67a65f60e6e1d4dd78c9c03a',
        )
      } catch (error) {
        localStorage.removeItem(env.VITE_SESSION_KEY)
      } finally {
        setLoading(false)
      }
    }
  }, [])

  return { isDemoAccount, loading }
}

export default useDemoAccount
