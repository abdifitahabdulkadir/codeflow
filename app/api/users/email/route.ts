import UserModel from "@/database/user.model"
import handleError from "@/lib/handlers/error"
import { NotFoundError, ValidationError } from "@/lib/http-errros"
import dbConnect from "@/lib/mongoose"
import { UserSchema } from "@/lib/validations"
import { ApiErroResponse } from "@/types/glabal"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email } = await req.json()

  try {
    const validate = UserSchema.partial().safeParse({ email })
    if (!validate.success) {
      throw new ValidationError(validate.error.flatten().fieldErrors)
    }

    await dbConnect()

    // check if there is an user with the email in DB
    const userExisted = await UserModel.findOne({ email })
    if (!userExisted) {
      throw new NotFoundError("User not found")
    }

    return NextResponse.json(
      { success: true, data: userExisted },
      { status: 200 },
    )
  } catch (error) {
    return handleError("api", error) as ApiErroResponse
  }
}
