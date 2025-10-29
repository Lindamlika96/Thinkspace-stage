/**
 * Authentication Configuration for ThinkSpace
 * 
 * This file configures authentication using NextAuth.js with JWT tokens,
 * session management, and security features optimized for the ThinkSpace
 * PARA methodology knowledge management system.
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

// JWT token interface extension
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
  }
}

// Session interface extension
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      createdAt: Date;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
  }
}

// Password hashing utilities
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
  password: string,
  hashedPassword?: string
): Promise<boolean> => {
  return hashedPassword ? await bcrypt.compare(password, hashedPassword) : false;
};

// User validation function
const validateUser = async (email: string, password: string) => {
  try {
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        createdAt: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password ?? undefined);
    if (!isValidPassword) {
      return null;
    }

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error('Error validating user:', error);
    return null;
  }
};

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  // Note: Not using PrismaAdapter with JWT strategy and credentials provider
  
  // Authentication providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your@email.com'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Your password'
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await validateUser(credentials.email, credentials.password);

        if (!user) {
          throw new Error('Invalid email or password');
        }

        return user;
      },
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),

    // GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callback functions
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-in
      if (account && account.provider !== 'credentials') {
        try {
          // Check if user exists
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          // Create user if doesn't exist
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || profile?.name || 'User',
                avatar: user.image,
                password: '', // OAuth users don't have passwords
                role: 'USER',
                isActive: true,
              },
            });
          }

          return true;
        } catch (error) {
          console.error('Error during OAuth sign-in:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        // For OAuth providers, fetch additional user data from database
        if (account && account.provider !== 'credentials') {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email! },
              select: {
                id: true,
                role: true,
                createdAt: true,
              },
            });

            if (dbUser) {
              token.id = dbUser.id;
              token.role = dbUser.role;
              token.createdAt = dbUser.createdAt;
            }
          } catch (error) {
            console.error('Error fetching user data for JWT:', error);
          }
        } else {
          // For credentials provider, use the user object directly
          token.role = user.role;
          token.createdAt = user.createdAt;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          createdAt: token.createdAt,
        };
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Handle relative callback URLs
      if (url.startsWith('/')) {
        // Prevent redirect loops to auth pages
        if (url === '/signin' || url === '/signup') {
          return baseUrl;
        }
        // Prevent redirect loops with query parameters
        if (url.includes('callbackUrl')) {
          return baseUrl;
        }
        return `${baseUrl}${url}`;
      }

      // Handle absolute URLs
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);

        // Check if same origin
        if (urlObj.origin === baseUrlObj.origin) {
          const pathname = urlObj.pathname;
          // Prevent redirect loops to auth pages
          if (pathname === '/signin' || pathname === '/signup') {
            return baseUrl;
          }
          // Prevent redirect loops with query parameters
          if (url.includes('callbackUrl')) {
            return baseUrl;
          }
          return url;
        }
      } catch (error) {
        // If URL parsing fails, return baseUrl
        return baseUrl;
      }

      // Default to base URL for external URLs
      return baseUrl;
    },
  },

  // Custom pages
  pages: {
    signIn: '/signin',
    error: '/error',
  },

  // Events
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
      
      // Update last login timestamp
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      } catch (error) {
        console.error('Error updating last login:', error);
      }
    },

    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`);
    },
  },

  // Security settings
  secret: process.env.NEXTAUTH_SECRET,
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
};

// Import getServerSession for server-side usage
import { getServerSession } from 'next-auth/next';

// Helper function to get current user from session
export const getCurrentUser = async () => {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Role-based access control helper
export const hasRole = (user: any, requiredRole: string): boolean => {
  if (!user || !user.role) return false;

  const roleHierarchy = ['USER', 'ADMIN', 'SUPER_ADMIN'];
  const userRoleIndex = roleHierarchy.indexOf(user.role);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

  return userRoleIndex >= requiredRoleIndex;
};

export { getServerSession };
