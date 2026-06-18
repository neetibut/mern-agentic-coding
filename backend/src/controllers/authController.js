import User from "../models/User.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookie.js";

export async function register(req, res, next) {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    setAuthCookie(res, user._id);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    setAuthCookie(res, user._id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export function logout(_req, res) {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
