import AccountModel from "@/database/account.model"
import database from "@/lib/dbconnection"
import handleError from "@/lib/handlers/error"
import { NotFoundError, ValidationError } from "@/lib/http-errros"
import dbConnect from "@/lib/mongoose"
import { AccountSchema } from "@/lib/validations"
import { ApiErroResponse } from "@/types/glabal"
import { NextRequest, NextResponse } from "next/server"

// get account by id -> api/accounts/[id]/route.ts
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    if (!id) throw new NotFoundError("Account")
    await dbConnect()
    const account = await AccountModel.findOne({
      providerAccountId: id,
    })
    if (!account) throw new NotFoundError("Account")
    return NextResponse.json(
      {
        success: true,
        data: account,
        userFakeId: id,
      },
      { status: 200 },
    )
  } catch (error) {
    return handleError("api", error) as ApiErroResponse
  }
}

// delete account ->api/accounts/[id]/route.ts
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    if (!id) throw new NotFoundError("Account")
    await database.connect()

    const deletedAccount = await AccountModel.findByIdAndDelete(id)
    if (!deletedAccount) throw new NotFoundError("Account")
    return NextResponse.json(
      {
        success: true,
        message: "Account deleted successfully",
        data: deletedAccount,
      },
      { status: 204 },
    )
  } catch (error) {
    return handleError("api", error) as ApiErroResponse
  }
}
// update account -> api/accounts/[id]/route.ts
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const data = await req.json()
  const { id } = await params

  try {
    await database.connect()

    // instead of safeParse , parital only
    // validates the fields that are present in the data
    const validatedData = AccountSchema.partial().safeParse(data)

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors)
    }
    const updatedAccount = await AccountModel.findByIdAndUpdate(
      id,
      validatedData.data,
      {
        new: true,
      },
    )

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 },
    )
  } catch (error) {
    return handleError("api", error) as ApiErroResponse
  }
}
