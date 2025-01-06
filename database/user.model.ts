import { model, models, Schema, Types } from "mongoose"

export interface UserDoc {
  _id?: Types.ObjectId
  name: string
  username: string
  email: string
  bio?: string
  image?: string
  location?: string
  portfolio?: string
  reputation?: number
}

const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number },
  },
  { timestamps: true },
)

const UserModel = models?.UserModel || model<UserDoc>("UserModel", UserSchema)

export default UserModel
