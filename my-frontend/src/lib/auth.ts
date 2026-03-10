// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL, // URLs ของ Backend ของคุณ
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: true },
        approve: { type: "boolean", required: false },
      },
    }),
  ],
});
