import { NextResponse } from "next/server";

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  avatar: string;
  value: number;
}

interface Question {
  _id: string;
  title: string;
  body: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  answerscount: number;
  views: number;
}

interface SigninWithOAuthProps {
  user: {
    name?: string;
    email?: string;
    username?: string;
  };
  provider: string;
  providerAccountId: string;
}

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
