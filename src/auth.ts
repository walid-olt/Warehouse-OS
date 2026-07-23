import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import authConfig from "./auth.config";
import { getUserByEmail } from "./features/auth/lib";
import { loginUserSchema } from "./features/auth/schemas/userSchema";

// No idea how any of this work 🥀💔
export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.info(credentials);
        const { success, data } = loginUserSchema.safeParse(credentials);
        if (!success) return null;

        await connectDB();

        const { email, password } = data;
        const user = await getUserByEmail(email);
        if (!user) return null;

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.info(token, user);
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.info(session, token);
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
