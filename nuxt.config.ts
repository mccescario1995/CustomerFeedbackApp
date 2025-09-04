// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@sidebase/nuxt-auth"],

  css: ["../assets/css/main.css"],

  ui: {
    colorMode: true,
  },

  runtimeConfig: {
    colorMode: process.env.NUXT_PUBLIC_COLOR_BUTTON,
    public: {},
    private: {},
  },

  auth: {
    // originEnvKey: 'NUXT_BASE_URL',
    provider: {
      type: "local",
      session: {
        dataType: {
          Id: "string | number",
          Email: "string",
          FirstName: "string",
          LastName: "string",
          ProfileImage: "string",
          Roles: "string[]",
          CreatedAt: "string",
        },
      },
      endpoints: {
        signIn: {
          path: "http://localhost:5243/api/auth/login",
          method: "post",
        },
        signUp: {
          path: "http://localhost:5243/api/auth/register",
          methods: "post",
        },
        signOut: {
          path: "http://localhost:5243/api/auth/logout",
          method: "post",
        },
        getSession: {
          path: "http://localhost:5243/api/auth/session",
          method: "get",
        },
      },
      token: {
        signInResponseTokenPointer: "/token",
      },
    },
    // globalAppMiddleware: true
  },
  imports: {
    dirs: ["layouts", "types"],
  },
});
