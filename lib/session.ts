import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId?: string;
  email?: string;
  name?: string;
}

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret && process.env.NODE_ENV === "production") {
  throw new Error(
    "SESSION_SECRET must be set in production"
  );
}

export const sessionOptions: SessionOptions = {
  password:
    sessionSecret ||
    "development-only-secret-change-before-production-32",

  cookieName: "campusiq_session",

  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(
    cookies(),
    sessionOptions
  );
}
