import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt", // Using JWT session
    maxAge: 24 * 60 * 60, // Default session expiration of 1 day
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Check if the "rememberMe" flag is set
      if (account && user && account.provider && user.id) {
        // Assuming the "rememberMe" value is passed from the login page
        const rememberMe = user?.rememberMe ?? false; // You may need to pass this when signing in
        token.maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days if rememberMe is true, else 1 day
        console.log('JWT Token:', token);
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback Triggered');
      // Extend the session expiration based on JWT token's maxAge
      session.expires = new Date(Date.now() + (token.maxAge * 1000)); // Set the session expiration time
      console.log('Session:', session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});
