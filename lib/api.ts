import { AccountDoc } from "@/database/account.model"
import { UserDoc } from "@/database/user.model"
import { fetchHandler } from "./handlers/fetch"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export const api = {
  oauth: {
    async signinWithOAuth({
      user,
      provider,
      providerAccountId,
    }: SigninWithOAuthProps) {
      return fetchHandler<UserDoc>(`${BASE_URL}/auth/social-media`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      })
    },
  },
  users: {
    getAll() {
      return fetchHandler<UserDoc>(`${BASE_URL}/users`)
    },
    getById(id: string) {
      return fetchHandler<UserDoc>(`${BASE_URL}/users/${id}`)
    },
    getByEmail(email: string) {
      return fetchHandler<UserDoc>(`${BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      })
    },
    create(user: Partial<UserDoc>) {
      return fetchHandler<UserDoc>(`${BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(user),
      })
    },
    deleteById(id: string) {
      return fetchHandler<UserDoc>(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      })
    },
    updateById(id: string, user: Partial<UserDoc>) {
      return fetchHandler<UserDoc>(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(user),
      })
    },
  },
  accounts: {
    getAll() {
      return fetchHandler<AccountDoc>(`${BASE_URL}/accounts`)
    },
    create(account: Partial<AccountDoc>) {
      return fetchHandler<AccountDoc>(`${BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(account),
      })
    },
    async getByProvider(providerAccountId: string) {
      return await fetchHandler<AccountDoc>(`${BASE_URL}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      })
    },
    async getByProviderId(id: string) {
      return await fetchHandler<AccountDoc>(`${BASE_URL}/accounts/${id}`)
    },

    deleteById(id: string) {
      return fetchHandler<AccountDoc>(`${BASE_URL}/accounts/${id}`, {
        method: "DELETE",
      })
    },
    updateById(id: string, account: Partial<AccountDoc>) {
      return fetchHandler<AccountDoc>(`${BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(account),
      })
    },
  },
}
