import { NextResponse } from "next/server";

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  errors?: {
    message: string;
    details: Record<string, string[]>;
  };
  statusCode?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & {
  success: true;
};

type ErrorResponse = ActionResponse<undefined> & { success: false };

type ApiErroResponse = NextResponse<ErrorResponse>;

type ApiResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}
