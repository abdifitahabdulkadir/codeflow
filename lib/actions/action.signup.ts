"use server";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import User, { IUser } from "@/database/user.model";
import { ActionResponse, ErrorResponse } from "@/types/glabal";
import bcrpt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";
import { actionHandler } from "../handlers/action";
import handleError from "../handlers/error";
import { SignUpSchema } from "../validations";

type ParmasType = z.infer<typeof SignUpSchema> & {
  name?: string;
};

export async function signUpWithCrendentials(
  params: ParmasType,
): Promise<ActionResponse> {
  const validatedResult = await actionHandler({
    params,
    schema: SignUpSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError("server", validatedResult) as ErrorResponse;
  }

  const { email, password, username } = validatedResult.params!;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existedUer = await User.findOne({ email }).session(session);

    if (existedUer) {
      return handleError(
        "server",
        new Error("User is already existed"),
      ) as ErrorResponse;
    }
    const usernameExisted = await User.findOne({ username }).session(session);

    if (usernameExisted) {
      return handleError(
        "server",
        Error("Username is existed before."),
      ) as ErrorResponse;
    }

    // hash the password
    const hashedPassword = await bcrpt.hash(password, 10);

    const [newUser] = await User.create<IUser>(
      [
        {
          name: username,
          email,

          username,
        },
      ],
      { session },
    );
    // create account that associates with that user.
    await Account.create(
      [
        {
          userId: newUser._id,
          name: username,
          provider: "credentials",
          password: hashedPassword,
          providerAccountId: email,
        },
      ],
      { session },
    );
    await session.commitTransaction();
    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError("server", error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
