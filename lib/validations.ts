import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long. " })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^0-9a-zA-Z]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title cannot exceed 100 characters." }),

  content: z.string().min(1, { message: "Content is required." }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag is required." })
        .max(30, { message: "Tag cannot exceed 30 characters." }),
    )
    .min(1, { message: "Tags is required." })
    .max(5, { message: "You can only add up to 5 tags." }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const GetQuestionDetailSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});
export const UserSchema = z.object({
  name: z.string().min(4, { message: "minimum 4 characters is required" }),
  username: z.string().min(4, { message: "minimum 4 characters is required" }),
  email: z.string().email(),
  bio: z.string().optional(),
  image: z.string().url("Please provide valid image url").optional(),
  location: z.string().optional(),
  reputation: z.number().int().optional(),
  portfolio: z.string().url("please provide valid portfolio url").optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.enum(["google", "github", "credentials"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github", "credentials"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account Id is required" }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
      .string()
      .email({ message: "Please provide a valid email address." }),
    username: z.string().min(1, { message: "username is required" }),
    image: z
      .string()
      .url({ message: "Please provide a valid URL." })
      .optional(),
  }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.omit({
  filter: true,
}).extend({
  tagId: z.string().min(1, { message: "Tag ID is required." }),
});

export const IncrementViewsParamsSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const AnswerFormSchema = z.object({
  content: z
    .string()
    .min(100, { message: "Answer content must have 100 characters." }),
});

export const CreateAnswerSchema = AnswerFormSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().min(1, { message: "Question Id is required" }),
});

export const CreateVoteCountSchema = z.object({
  targetId: z.string().min(1, "Target Id is required"),
  targetType: z.enum(["question", "answer"]),
  voteType: z.enum(["upvote", "downvote"]),
});

export const UpdateVotecountSchema = CreateVoteCountSchema.extend({
  change: z
    .number()
    .int()
    .min(-1, "Change value should be -1 at minimum")
    .max(1, "Change value should be 1 at maximum"),
});

export const HasVotedResponseSchema = CreateVoteCountSchema.omit({
  voteType: true,
});

export const CollectionBasedSchema = z.object({
  questionId: z.string().min(1, "Question Id is required"),
});
