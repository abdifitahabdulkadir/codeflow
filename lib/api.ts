import { IAccount } from "@/database/account.model";
import { IUser } from "@/database/user.model";
import { fetchHandler } from "./handlers/fetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const api = {
  users: {
    getAll() {
      return fetchHandler<IUser>(`${BASE_URL}/users`);
    },
    getById(id: string) {
      return fetchHandler<IUser>(`${BASE_URL}/users/${id}`);
    },
    getByEmail(email: string) {
      return fetchHandler<IUser>(`${BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    create(user: Partial<IUser>) {
      return fetchHandler<IUser>(`${BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(user),
      });
    },
    deleteById(id: string) {
      return fetchHandler<IUser>(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      });
    },
    updateById(id: string, user: Partial<IUser>) {
      return fetchHandler<IUser>(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(user),
      });
    },
  },
  accounts: {
    getAll() {
      return fetchHandler<IAccount>(`${BASE_URL}/accounts`);
    },
    create(account: Partial<IAccount>) {
      return fetchHandler<IAccount>(`${BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(account),
      });
    },
    getByProvider(providerAccountId: string) {
      return fetchHandler<IAccount>(`${BASE_URL}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      });
    },
    getById(id: string) {
      return fetchHandler<IAccount>(`${BASE_URL}/accounts/${id}`);
    },

    deleteById(id: string) {
      return fetchHandler<IAccount>(`${BASE_URL}/accounts/${id}`, {
        method: "DELETE",
      });
    },
    updateById(id: string, account: Partial<IAccount>) {
      return fetchHandler<IAccount>(`${BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(account),
      });
    },
  },
};
