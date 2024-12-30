import { IAccount } from "@/database/account.model";
import User from "@/database/user.model";

import handleError from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errros";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { ApiErroResponse } from "@/types/glabal";
import { NextResponse } from "next/server";

// get all users
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError("api", error) as ApiErroResponse;
  }
}

// create a user
export async function POST(req: Request) {
  try {
    await dbConnect();

    const acount = await req.json();

    // validate
    const validateAccount = AccountSchema.parse(acount);
    // check if it is existed as email
    const existedAccount = await User.findOne<IAccount>({
      provoderAccountId: validateAccount.providerAccountId,
      provider: validateAccount.provider,
    });
    if (existedAccount) {
      throw new ForbiddenError("User with given Provider is already existed");
    }

    // create new account
    const newAccount = await User.create(validateAccount);
    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 },
    );
  } catch (error) {
    return handleError("api", error) as ApiErroResponse;
  }
}
