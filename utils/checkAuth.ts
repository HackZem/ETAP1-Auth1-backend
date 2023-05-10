import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || "")
    .replace(/Bearer\s?/, "")
    .trim();

  if (token) {
    try {
      const decodedToken = jwt.verify(token, "authbackendsecretkey");

      req["userId"] = decodedToken["_id"];

      next();
    } catch (err) {
      console.log(err);
      return res.status(403).json({
        message: "No access",
      });
    }
  } else {
    return res.status(403).json({
      message: "No access",
    });
  }
};
