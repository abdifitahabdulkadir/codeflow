import { AccountDoc } from "@/database/account.model"
import UserModel from "@/database/user.model"

import handleError from "@/lib/handlers/error"
import { ForbiddenError } from "@/lib/http-errros"
import dbConnect from "@/lib/mongoose"
import { AccountSchema } from "@/lib/validations"
import { ApiErroResponse } from "@/types/glabal"
import { NextResponse } from "next/server"

// get all users
export async function GET() {
  try {
    await dbConnect()
    const users = await UserModel.find()
    return NextResponse.json({ success: true, data: users }, { status: 200 })
  } catch (error) {
    return handleError("api", error) as ApiErroResponse
  }
}

// create a user
export async function POST(req: Request) {
  try {
    await dbConnect()

    const acount = await req.json()

    // validate
    const validateAccount = AccountSchema.parse(acount)
    // check if it is existed as email
    const existedAccount = await UserModel.findOne<AccountDoc>({
      provoderAccountId: validateAccount.providerAccountId,
      provider: validateAccount.provider,
    })
    if (existedAccount) {
      throw new ForbiddenError("User with given Provider is already existed")
    }

    // create new account
    const newAccount = await UserModel.create(validateAccount)
    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 },
    )
  } catch (error) {
    return handleError("api", error) as ApiErroResponse
  }
}
