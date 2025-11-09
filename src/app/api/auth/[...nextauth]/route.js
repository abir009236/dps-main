import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password, role } = credentials;
        // Check if email and password are provided
        if (!email || !password) {
          return null;
        }
        try {
          if (role === "User") {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              }
            );

            if (res.status === 404 || res.status === 401) {
              return null;
            }

            const data = await res.json();
            return data;
          } else if (role === "Admin") {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/admin-login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              }
            );

            if (res.status === 401 || res.status === 404) {
              return null;
            }
            const data = await res.json();
            return data;
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (user?.id) {
          token._id = user?.id;
        } else {
          token._id = user?._id;
        }
        token.role = user?.role;
        token.profilePicture = user?.profilePicture;
        token.name = user?.name;
        token.email = user?.email;
        token.status = user?.status;
        token.phone = user?.phone;
        token.refundBalance = user?.refundBalance;
      }
      if (account?.provider === "google") {
        token.provider = "google";
      }
      return token;
    },
    // Attach the custom data from the JWT token to the session
    async session({ session, token }) {
      if (token) {
        session.role = token?.role;
        session._id = token?._id;
        session._id = token?._id;
        session.profilePicture = token?.profilePicture;
        session.name = token?.name;
        session.email = token?.email;
        session.status = token?.status;
        session.phone = token?.phone;
        session.provider = token?.provider;
        session.refundBalance = token?.refundBalance;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // for google provider
        if (account.provider === "google") {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/google-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                profile_picture: user.image,
              }),
            }
          );

          if (res.ok) {
            const data = await res.json();
            user.id = data?.user?._id;
            user.role = data?.user?.role;
            user.profilePicture = data?.user?.profilePicture;
            user.name = data?.user?.name;
            user.email = data?.user?.email;
            user.status = data?.user?.status;
            user.phone = data?.user?.phone;
            return true;
          }

          return false;
        }
        // For credentials provider, the user object already contains role from your login API
        if (account.provider === "credentials") {
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Deny sign in if there's an error
      }
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
