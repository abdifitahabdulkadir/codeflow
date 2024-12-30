import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errros";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { ApiErroResponse } from "@/types/glabal";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { providerAccountId } = await req.json();
    const verifyProviderAccountId = AccountSchema.partial().safeParse({
      providerAccountId,
    });
    if (!verifyProviderAccountId.success)
      throw new ValidationError(
        verifyProviderAccountId.error.flatten().fieldErrors,
      );
    await dbConnect();

    const accountExisted = await Account.findOne({ providerAccountId });
    if (!accountExisted) throw new NotFoundError("Account With given Email ");

    return NextResponse.json(
      { success: true, data: accountExisted },
      { status: 201 },
    );
  } catch (error) {
    return handleError("api", error) as ApiErroResponse;
  }
}
