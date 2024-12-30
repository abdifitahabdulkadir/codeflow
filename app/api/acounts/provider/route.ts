import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errros";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { ApiErroResponse } from "@/types/glabal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { providerAccountId } = await req.json();
  try {
    const validate = AccountSchema.partial().safeParse({ providerAccountId });
    if (!validate.success) {
      throw new ValidationError(validate.error.flatten().fieldErrors);
    }

    await dbConnect();

    // check if there is an user with the providerAccountId in DB
    const accountExisted = await Account.findOne({ providerAccountId });
    if (!accountExisted) {
      throw new NotFoundError("User not found");
    }

    return NextResponse.json(
      { success: true, data: accountExisted },
      { status: 200 },
    );
  } catch (error) {
    return handleError("api", error) as ApiErroResponse;
  }
}
