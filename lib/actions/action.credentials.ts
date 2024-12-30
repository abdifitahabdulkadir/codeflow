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
import { NotFoundError } from "../http-errros";
import { SignInSchema, SignUpSchema } from "../validations";

// signup action
export async function signUpWithCrendentials(
  params: Pick<z.infer<typeof SignUpSchema>, "email" | "password" | "username">,
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

  let transactionCommited = false;
  try {
    const existedUer = await User.findOne({ email }).session(session);

    if (existedUer) throw new Error("User is already existed");

    const usernameExisted = await User.findOne({ username }).session(session);

    if (usernameExisted) throw new Error("Username is existed before.");

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
    transactionCommited = true;
    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    if (!transactionCommited) await session.abortTransaction();
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
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    throw new Error(validatedResult.message);
  }

  const { email, password } = validatedResult.params!;

  try {
    const existedUer = await User.findOne({ email });
    if (!existedUer) throw new NotFoundError("User");

    const existedAccount = await Account.findOne({
      providerAccountId: email,
    });
    if (!existedAccount) throw new NotFoundError("Account");

    // check if the current passwrod matches the hashed password
    const matchedPassword = await bcrpt.compare(
      password,
      existedAccount.password,
    );
    if (!matchedPassword) throw new Error("passwrod did not match");

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError("server", error) as ErrorResponse;
  }
}
