import Account from "@/database/account.model";
import dbConnect from "@/lib/dbconnection";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errros";
import { AccountSchema } from "@/lib/validations";
import { ApiErroResponse } from "@/types/glabal";
import { NextRequest, NextResponse } from "next/server";

// get account by id -> api/accounts/[id]/route.ts
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    if (!id) throw new NotFoundError("Account");

    await dbConnect();
    const account = await Account.findById(id);
    if (!account) throw new NotFoundError("Account");
    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError("api", error) as ApiErroResponse;
  }
}

// delete account ->api/accounts/[id]/route.ts
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    if (!id) throw new NotFoundError("Account");

    await dbConnect();
    const deletedAccount = await Account.findByIdAndDelete(id);
    if (!deletedAccount) throw new NotFoundError("Account");
    return NextResponse.json(
      {
        success: true,
        message: "Account deleted successfully",
        data: deletedAccount,
      },
      { status: 204 },
    );
  } catch (error) {
    return handleError("api", error) as ApiErroResponse;
  }
}
// update account -> api/accounts/[id]/route.ts
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const data = await req.json();
  const { id } = await params;

  try {
    await dbConnect();

    // instead of safeParse , parital only
    // validates the fields that are present in the data
    const validatedData = AccountSchema.partial().safeParse(data);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      validatedData.data,
      {
        new: true,
      },
    );

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 },
    );
  } catch (error) {
    return handleError("api", error) as ApiErroResponse;
  }
}
