import User from "../models/User.js";
import { clearAuthCookie } from "../utils/cookie.js";

// Enforce the "exactly one default" invariant on a user's address list:
// at most one default, and exactly one whenever there is >= 1 address.
// Promotes the most-recently-added address (last in the subdoc array, since
// ObjectIds are monotonic) when no valid default remains.
function normalizeDefault(user) {
  const addresses = user.addresses;
  if (addresses.length === 0) return;

  const defaults = addresses.filter((a) => a.isDefault);
  if (defaults.length === 1) return;

  // Zero defaults, or more than one — reset and elect a single winner.
  // Prefer the existing most-recently-set default; otherwise the newest address.
  const winner = defaults.length > 1 ? defaults[defaults.length - 1] : addresses[addresses.length - 1];
  for (const address of addresses) {
    address.isDefault = address === winner;
  }
}

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
    // First address (or any list with no default) gets one assigned.
    normalizeDefault(user);
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

    const wasDefault = address.isDefault;
    address.deleteOne();
    // If we removed the default, promote the most-recently-added remaining one.
    if (wasDefault) normalizeDefault(user);
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function setDefaultAddress(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const target = user.addresses.id(req.params.addressId);
    if (!target) return res.status(404).json({ message: "Address not found" });

    // Clear every default, then set exactly the target — switching is exclusive.
    for (const address of user.addresses) {
      address.isDefault = address === target;
    }

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
