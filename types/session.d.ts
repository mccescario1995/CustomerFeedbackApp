// types/session.d.ts
declare module "h3" {
  interface SessionData {
    user?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      profileImage?: string;
      // Add other user properties you're storing in the session
    };
    // Add other session properties if needed
  }
}

export {};
