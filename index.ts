import { getMe, login, register } from "./controllers/UserController";
import { registerValidation } from "./validations/auth";
import express, { Express } from "express";
import mdb from "mongoose";
import cors from "cors";
import checkAuth from "./utils/checkAuth.ts";

mdb
  .connect(
    "mongodb+srv://HackZem:scram@cluster0.mbolfca.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MDB Ok");
  })
  .catch((err) => {
    console.log("MDB error", "!!!" + err + "!!!");
  });

const app: Express = express();
app.use(cors());
app.use(express.json());

app.post("/auth/register", registerValidation, register);
app.post(
  "/auth/login",

  login
);
app.get("/auth/me", checkAuth, getMe);

app.listen(4444, () => {
  console.log("Ok");
});
