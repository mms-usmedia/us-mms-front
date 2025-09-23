import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      picture?: string;
      roles?: string[];
      is_active?: boolean;
      created_at?: string;
      last_login?: string;
    };
  }

  interface User {
    id?: string;
    email?: string;
    name?: string;
    picture?: string;
    roles?: string[];
    is_active?: boolean;
    created_at?: string;
    last_login?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userData?: {
      id?: string;
      name?: string;
      email?: string;
      picture?: string;
      roles?: string[];
      is_active?: boolean;
      created_at?: string;
      last_login?: string;
    };
  }
}
