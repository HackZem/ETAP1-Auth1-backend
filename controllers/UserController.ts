import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.ts";
import bcrypt from "bcrypt";

type TControllerFunc = (req: Request, res: Response) => any | void;

export const register: TControllerFunc = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password: string = req.body.password;
    const salt = await bcrypt.genSalt(5);
    const hash: string = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      nickname: req.body.nickname,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "authbackendsecretkey",
      {
        expiresIn: "1d",
      }
    );
    const { passwordHash, ...userData } = user["_doc"];

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "No registrar",
    });
  }
};
export const login: TControllerFunc = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Email or password is incorrect",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return res.status(405).json({
        message: "Email or password is incorrect",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "authbackendsecretkey",
      {
        expiresIn: "1d",
      }
    );
    const { passwordHash, ...userData } = user["_doc"];
    console.log(token);
    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "No login",
    });
  }
};
export const getMe: TControllerFunc = async (req, res) => {
  try {
    const user = await UserModel.findById(req["userId"]);

    if (!user) {
      return res.status(404).json({
        message: "No user",
      });
    }

    const { passwordHash, ...userData } = user["_doc"];

    return res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "No access",
    });
  }
};
