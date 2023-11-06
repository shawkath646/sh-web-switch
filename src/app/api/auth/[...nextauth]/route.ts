import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';


const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: "Username" },
        password: { label: 'Password', type: 'password', placeholder: "Password" },
      },
      async authorize(credentials, req) {        
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }
        const userRef = doc(db, 'users', credentials.username);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          if (credentials.password === userDoc.data().password) {
            return { id: credentials.username, name: userDoc.data().name, username: credentials.username };
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { authOptions, handler as GET, handler as POST }