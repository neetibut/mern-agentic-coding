import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  deleteAccount,
} from "../controllers/userController.js";

const router = Router();

// Every user route requires a valid session.
router.use(auth);

router.put("/me", updateProfile);
router.delete("/me", deleteAccount);

router.post("/me/addresses", addAddress);
router.put("/me/addresses/:addressId", updateAddress);
router.put("/me/addresses/:addressId/default", setDefaultAddress);
router.delete("/me/addresses/:addressId", deleteAddress);

export default router;
