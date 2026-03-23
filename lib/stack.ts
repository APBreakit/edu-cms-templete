import { StackServerApp } from "@stackframe/stack"

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/admin/login",
    afterSignIn: "/admin",
    afterSignOut: "/admin/login",
  },
})
