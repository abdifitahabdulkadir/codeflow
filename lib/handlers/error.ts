import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { RequestError, ValidationError } from "../http-errros";

export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  statusCode: number,
  message: string,
  error?: Record<string, string[]> | undefined,
) => {
  const responseContent = {
    success: false,
    errors: {
      message,
      details: error,
    },
  };
  return responseType === "api"
    ? NextResponse.json(responseContent, { status: statusCode })
    : { ...responseContent, statusCode };
};

export default function handleError(
  responseType: ResponseType = "server",
  erros: unknown,
) {
  // if it is one of them defiend error.
  // then we have enough info
  if (erros instanceof RequestError) {
    return formatResponse(
      responseType,
      erros.statusCode,
      erros.message,
      erros.errors,
    );
  }

  // if it is ZodError (validationError)
  if (erros instanceof ZodError) {
    const validationError = new ValidationError(
      erros.flatten().fieldErrors as Record<string, string[]>,
    );
    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.name,
      validationError.errors,
    );
  }

  //  if it is general error .
  if (erros instanceof Error) {
    console.log("genral error");
    return formatResponse(responseType, 500, erros.message);
  }

  // then return general purpose server error.
  return formatResponse(responseType, 500, "UnExpected Error Occured");
}
