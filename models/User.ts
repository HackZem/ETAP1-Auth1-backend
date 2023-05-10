import mdb, { Schema } from "mongoose";

interface IUserSchema {
  nickname: string;
  email: string;
  passwordHash: string;
}

const UserSchema = new Schema<IUserSchema>(
  {
    nickname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mdb.model("User", UserSchema);
