import AccountModel from "@/database/account.model"
import UserModel from "@/database/user.model"
import handleError from "@/lib/handlers/error"
import { ValidationError } from "@/lib/http-errros"
import dbConnect from "@/lib/mongoose"
import { UserSchema } from "@/lib/validations"
import { ApiErroResponse } from "@/types/glabal"
import { Error } from "mongoose"
import { NextResponse } from "next/server"

// get all accounts
export async function GET() {
  try {
    await dbConnect()
    const accounts = await AccountModel.find()
    return NextResponse.json({ success: true, data: accounts }, { status: 200 })
  } catch (error) {
    return handleError("api", error) as ApiErroResponse
  }
}

// create a account
export async function POST(req: Request) {
  try {
    await dbConnect()
    const user = await req.json()

    // validate
    const validate = UserSchema.safeParse({
      ...user,
      reputation: parseInt(user.reputation),
    })

    if (!validate.success) {
      throw new ValidationError(validate.error.flatten().fieldErrors)
    }

    const { email, username } = validate.data

    // check if it is existed as email
    const existedUser = await UserModel.findOne({ email })
    if (existedUser) {
      throw new Error("User with provided Email is already existed")
    }

    // check it is existed as username
    const existedUsername = await UserModel.findOne({ username })
    if (existedUsername) {
      throw new Error("user with provided username is already existed")
    }

    // create new user
    const newUser = await UserModel.create(validate.data)
    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch (error) {
    return handleError("api", error) as ApiErroResponse
  }
}
