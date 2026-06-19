import User from "../models/User.js";
import { clearAuthCookie } from "../utils/cookie.js";

// Update basic profile fields (username, firstName, lastName).
export async function updateProfile(req, res, next) {
  try {
    const { username, firstName, lastName } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username !== undefined) user.username = username;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;

    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function addAddress(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { label, street, city, state, zip, country } = req.body;
    user.addresses.push({ label, street, city, state, zip, country });
    await user.save();
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateAddress(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    const fields = ["label", "street", "city", "state", "zip", "country"];
    for (const field of fields) {
      if (req.body[field] !== undefined) address[field] = req.body[field];
    }

    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    address.deleteOne();
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function deleteAccount(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    clearAuthCookie(res);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
}
