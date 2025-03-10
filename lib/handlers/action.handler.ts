"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import { ZodError, ZodSchema } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errros";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

export async function actionHandler<T>({
  params,
  schema,
  authorize,
}: ActionOptions<T>) {
  // if there is schema and parse then
  // validate and handle their erros
  if (schema && params) {
    try {
      schema.safeParse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>,
        );
      } else {
        return Error("Schema validation Failed");
      }
    }
  }

  // this true, means this server actions
  // needs to be done only by authorized users.
  let session: Session | null = null;
  if (authorize) {
    session = await auth();
    if (!session) {
      return new UnauthorizedError();
    }
  }

  await dbConnect();
  return { params, session };
}
