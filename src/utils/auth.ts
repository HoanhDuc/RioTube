import NextAuth, { Account, NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/youtube.readonly",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({
      token,
      account,
    }: {
      token: JWT;
      user: User;
      account: Account | null;
    }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires =
          Date.now() + (account.expires_in as number) * 1000;
        return token;
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token;
      return session;
    },
  },
};

export async function refreshAccessToken(token: JWT) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await axios.post(url, {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
      refresh_token: token.refreshToken,
      grant_type: "refresh_token",
    });

    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth(authOptions);
