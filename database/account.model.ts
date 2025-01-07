import { model, models, Schema, Types } from "mongoose";

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
  userId: { type: Schema.Types.ObjectId, required: true, ref: "UserModel" },
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
  models?.AccountModel || model<AccountDoc>("AccountModel", AccountSchema);

export default AccountModel;
