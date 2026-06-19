import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isProd() {
  return process.env.NODE_ENV === "production";
}

// In production the frontend (Vercel) and backend (Render) are on different
// domains, so the cookie is cross-site and must be SameSite=None + Secure.
// In local development over http we use Lax + non-secure so it works on localhost.
function cookieOptions() {
  return {
    httpOnly: true,
    secure: isProd(),
    sameSite: isProd() ? "none" : "lax",
    maxAge: MAX_AGE_MS,
    path: "/",
  };
}

export function setAuthCookie(res, userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

export function clearAuthCookie(res) {
  // maxAge is omitted so the cookie is cleared immediately; the rest of the
  // options must match what was set or some browsers won't clear it.
  const { maxAge, ...options } = cookieOptions();
  res.clearCookie(COOKIE_NAME, options);
}

export { COOKIE_NAME };
