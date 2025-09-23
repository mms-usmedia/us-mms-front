import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          // Llamar a nuestro backend con el token de Google
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: account.id_token,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();

            // Guardar el JWT token y datos del usuario
            account.access_token = data.data.access_token;
            account.user_data = data.data.user;

            return true;
          } else {
            console.error(
              "Error en autenticación con backend:",
              response.statusText
            );
            return false;
          }
        } catch (error) {
          console.error("Error en signIn callback:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and user data to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.userData = account.user_data as typeof token.userData;
      }
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.user = {
        ...session.user,
        ...(token.userData as Partial<typeof session.user>),
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
