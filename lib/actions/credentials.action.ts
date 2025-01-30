"use server";

import { signIn } from "@/auth";
import AccountModel from "@/database/account.model";
import UserModel, { UserDoc } from "@/database/user.model";
import { ActionResponse, ErrorResponse } from "@/types/glabal";
import bcrpt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";
import { actionHandler } from "../handlers/action";
import handleError from "../handlers/error";
import { SignInSchema, SignUpSchema } from "../validations";

// signup action
export async function signUpWithCrendentials(
  params: Pick<z.infer<typeof SignUpSchema>, "email" | "password" | "username">,
): Promise<ActionResponse> {
  const validatedResult = await actionHandler({
    params,
    schema: SignUpSchema,
    authorize: false,
  });

  if (validatedResult instanceof Error) {
    return handleError("server", validatedResult) as ErrorResponse;
  }

  const { email, password, username } = validatedResult.params!;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("I am inside here1");
    const existedUer = await UserModel.findOne({ email }).session(session);

    if (existedUer) throw new Error("User is already existed");

    const usernameExisted = await UserModel.findOne({ username }).session(
      session,
    );

    if (usernameExisted) throw new Error("Username is existed before.");

    // hash the password
    const hashedPassword = await bcrpt.hash(password, 10);

    const [newUser] = await UserModel.create<UserDoc>(
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
    await AccountModel.create(
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

    console.log("I am inside here2");
    await session.commitTransaction();
    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    if (!session.transaction.isCommitted) await session.abortTransaction();
    return handleError("server", error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

// signin action
export async function signInWithCredentials(
  params: Pick<z.infer<typeof SignUpSchema>, "email" | "password">,
): Promise<ActionResponse> {
  const validatedResult = await actionHandler({
    params,
    schema: SignInSchema,
    authorize: false,
  });
  if (validatedResult instanceof Error) {
    throw new Error(validatedResult.message);
  }
  const { email, password } = validatedResult.params!;

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}
