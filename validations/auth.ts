import { body } from "express-validator";

export const registerValidation = [
  body("email", "Email is invalid").isEmail(),
  body("password", "Minimum 5 symbol and maximum 20 symbol").isLength({
    min: 5,
    max: 20,
  }),
  body("nickname", "Minimum 3 symbol and maximum 20 symbol").isLength({
    min: 3,
    max: 20,
  }),
];
