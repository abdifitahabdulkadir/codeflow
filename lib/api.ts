import { IAccount } from "@/database/account.model";
import { IUser } from "@/database/user.model";
import { ActionResponse, SigninWithOAuthProps } from "@/types/glabal";
import { fetchHandler } from "./handlers/fetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const api = {
  oauth: {
    async signinWithOAuth({
      user,
      provider,
      providerAccountId,
    }: SigninWithOAuthProps) {
      const data = await fetchHandler<ActionResponse<IUser>>(
        `${BASE_URL}/auth/social-media`,
        {
          method: "POST",
          body: JSON.stringify({ user, provider, providerAccountId }),
        },
      );
      console.log("data--> ", data);
      return data;
    },
  },
  users: {
    getAll() {
      return fetchHandler<ActionResponse<IUser>>(`${BASE_URL}/users`);
    },
    getById(id: string) {
      return fetchHandler<ActionResponse<IUser>>(`${BASE_URL}/users/${id}`);
    },
    getByEmail(email: string) {
      return fetchHandler<ActionResponse<IUser>>(`${BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    create(user: Partial<IUser>) {
      return fetchHandler<ActionResponse<IUser>>(`${BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(user),
      });
    },
    deleteById(id: string) {
      return fetchHandler<ActionResponse<IUser>>(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      });
    },
    updateById(id: string, user: Partial<IUser>) {
      return fetchHandler<ActionResponse<IUser>>(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(user),
      });
    },
  },
  accounts: {
    getAll() {
      return fetchHandler<ActionResponse<IAccount>>(`${BASE_URL}/accounts`);
    },
    create(account: Partial<IAccount>) {
      return fetchHandler<ActionResponse<IAccount>>(`${BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(account),
      });
    },
    async getByProvider(providerAccountId: string) {
      const data = await fetchHandler<ActionResponse<IAccount>>(
        `${BASE_URL}/accounts/provider`,
        {
          method: "POST",
          body: JSON.stringify({ providerAccountId }),
        },
      );
      console.log(data);

      return data;
    },
    getByProviderId(id: string) {
      return fetchHandler<ActionResponse<IAccount>>(
        `${BASE_URL}/accounts/${id}`,
      );
    },

    deleteById(id: string) {
      return fetchHandler<ActionResponse<IAccount>>(
        `${BASE_URL}/accounts/${id}`,
        {
          method: "DELETE",
        },
      );
    },
    updateById(id: string, account: Partial<IAccount>) {
      return fetchHandler<ActionResponse<IAccount>>(
        `${BASE_URL}/accounts/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(account),
        },
      );
    },
  },
};
