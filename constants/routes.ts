export const ROUTES = {
  HOME: "/",
  SIGN_UP: "/sign-up",
  SIGN_IN: "/sign-in",
  PROFILE: (id: string) => `/profile/${id}`,
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  QUESIONS: (id: string) => `/questions/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
  ASK_QUEISION: "/ask-question",
}
