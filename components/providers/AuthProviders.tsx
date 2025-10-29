/**
 * Authentication Providers for ThinkSpace
 * 
 * This component wraps all client-side providers needed for authentication pages,
 * including SessionProvider for NextAuth.js session management.
 */

'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface AuthProvidersProps {
  children: ReactNode;
}

export function AuthProviders({ children }: AuthProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

