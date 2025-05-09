import { model, models, Schema, Types } from "mongoose";
import UserModel from "./user.model";

export interface AccountDoc {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  image?: string;
  provider: "Google" | "Github" | "Credentials"[];
  password?: string;
  providerAccountId: string;
}
const AccountSchema = new Schema<AccountDoc>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: UserModel },
  name: { type: String, required: true },
  image: { type: String },
  password: String,
  provider: {
    type: String,
    enum: ["google", "github", "credentials"],
    required: true,
  },
  providerAccountId: { type: String, required: true },
});

const AccountModel =
  models?.Account || model<AccountDoc>("Account", AccountSchema);

export default AccountModel;
