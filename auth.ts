import bycrpt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import { SignInSchema } from "./lib/validations";

const message: string =
  "Invalid Crendentials -password or email is not correct";
class InvalidCrendentials extends CredentialsSignin {
  constructor() {
    super(message);
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET_ID,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const validatedData = SignInSchema.safeParse(credentials);

        if (validatedData.success) {
          const { email, password } = validatedData.data;

          const { data: existedUserAccount, success: accountSuccess } =
            await api.accounts.getByProvider(email);

          if (!accountSuccess) throw new InvalidCrendentials();

          const { data: existedUser, success: userSuccess } =
            await api.users.getById(String(existedUserAccount?.userId));

          if (!userSuccess) throw new InvalidCrendentials();

          const verifyPassword = await bycrpt.compare(
            password,
            existedUserAccount?.password ?? "",
          );

          if (!verifyPassword) throw new InvalidCrendentials();

          return {
            id: String(existedUserAccount?.userId),
            name: existedUser?.name ?? "",
            email,
            image: existedUser?.image ?? null,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;
      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? String(profile?.login)
            : user?.name?.toLowerCase(),
      };
      const { success } = await api.oauth.signinWithOAuth({
        user: {
          email: userInfo.email,
          name: userInfo.name,
          username: userInfo.username,
          image: userInfo.image,
        },
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      });
      if (!success) return false;
      return true;
    },

    // modify jwt then will be avalaible in the session.
    async jwt({ token, account }) {
      if (account) {
        const { data: accountHolderData, success } =
          await api.accounts.getByProviderId(account.providerAccountId);
        if (!success) return token;
        token.sub = String(accountHolderData?.userId);
      }
      return token;
    },

    // we are getting current modified token id and add tothe session
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
  },
});
