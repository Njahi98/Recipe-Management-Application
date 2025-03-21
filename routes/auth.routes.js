const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per 15 minutes
  message: {
    error:
      "Too many login/register attempts, please try again after 15 minutes",
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

//Register
router.post(
  "/register",
  [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 15 })
      .withMessage("Username must be between 3 and 15 characters")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage(
        "Username can only contain letters, numbers, underscores and hyphens"
      )
      .trim()
      .escape(),
    body("email")
      .isEmail()
      .withMessage("please Provide a valid email")
      .normalizeEmail(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("password is required")
      .isLength({ min: 8, max: 15 })
      .withMessage("password must be between 8 and 15 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[^A-Za-z0-9]/)
      .withMessage("Password must contain at least one special character")
      .trim(),
  ],
  authLimiter,
  authController.register
);

//Login
router.post(
  "/login",
  //validated and sanitized data
  [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .trim()
      .escape(),
  ],
  authLimiter,
  authController.login
);

//Logout
router.get("/logout", authController.logout);

router.get("/login", authController.login_index);
router.get("/register", authController.register_index);

module.exports = router;
