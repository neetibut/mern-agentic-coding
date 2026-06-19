// Central error handler — turns Mongoose/validation errors into friendly JSON.
export default function errorHandler(err, _req, res, _next) {
  // Duplicate key (unique index) — e.g. username/email already taken.
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `That ${field} is already taken` });
  }

  // Mongoose schema validation.
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }

  // Invalid ObjectId, etc.
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifier" });
  }

  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
}
