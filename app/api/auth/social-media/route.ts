import AccountModel, { AccountDoc } from "@/database/account.model";
import UserModel from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errros";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import { ApiErroResponse } from "@/types/glabal";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request: Request) {
  const { user, provider, providerAccountId } = await request.json();
  await dbConnect();

  // sessions -- for atomic transactions
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // validate data
    const validateData = SignInWithOAuthSchema.safeParse({
      user,
      provider,
      providerAccountId,
    });
    if (!validateData.success)
      throw new ValidationError(validateData.error.flatten().fieldErrors);

    const { name, username, email, image } = user;

    const usernameFormatted = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    // check if user exsts -- and this operation fails entire transaction
    // should also fail
    let isUserExisted = await UserModel.findOne({ email }).session(session);

    // create if it is new user
    if (!isUserExisted) {
      [isUserExisted] = await UserModel.create(
        [{ name, username: usernameFormatted, email, image }],
        {
          session,
        },
      );
    }
    // updating some user information like image and username if he existed
    else {
      let { newImage, newName }: { newName: string; newImage: string } = {
        newName: "",
        newImage: "",
      };
      if (isUserExisted.name !== newName) newName = name;
      if (isUserExisted.image !== newImage) newImage = image;

      if (newName || newImage)
        await UserModel.updateOne(
          { email },
          {
            $set: {
              name: newName,
              image: newImage,
            },
          },
        ).session(session);
    }

    // find account that asssociat with user (if any)
    const userAccount = await AccountModel.findOne<AccountDoc>({
      userId: isUserExisted._id,
      provider,
      providerAccountId,
    }).session(session);

    // if account didnot exists
    if (!userAccount) {
      await AccountModel.create(
        [
          {
            userId: isUserExisted._id,
            name,
            provider,
            providerAccountId,
            image,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (!session.transaction.isCommitted) session.abortTransaction();
    return handleError("server", error) as ApiErroResponse;
  } finally {
    session.endSession();
  }
}
