import { model, models, Schema, Types } from "mongoose";

export interface IAccount {
  userId: Types.ObjectId;
  name: string;
  image?: string;
  provider: "Google" | "Github" | "Credentials"[];
  password?: string;
  providerAccountId: string;
}
const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true },
  image: { type: String },
  password: String,
  provider: {
    type: String,
    enum: ["Google", "Github", "Credentials"],
    required: true,
  },
  providerAccountId: { type: String, required: true },
});

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;
