import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, Session } from "next-auth";

// Define an extended Session type that includes an "id" property.
type ExtendedSession = Session & {
  user: {
    id: string;
  } & Session["user"];
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }): Promise<ExtendedSession> {
      // Ensure token.sub exists before proceeding.
      if (!token.sub) {
        throw new Error("User token is missing a subject identifier.");
      }

      // Return a new session object with the user's id added.
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      } as ExtendedSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // Loads your custom sign in page at the root
  },
};
