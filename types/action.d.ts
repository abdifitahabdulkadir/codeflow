interface TagI {
  _id?: Types.ObjectId | string;
  name: string;
  usage?: string;
}

interface AuthorI {
  _id?: Types.ObjectId;
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

interface QuestionI {
  _id?: Types.ObjectId | string;
  title?: string;
  content?: string;
  authorId: AuthorI;
  tags?: TagI[];
  views: number;
  upVotes: number;
  downVotes: number;
  answers: number;
  createdAt: Date;
}

export interface AnswerI {
  _id?: Types.ObjectId;
  authorId: AuthorI;
  questionId: Types.ObjectId;
  content: string;
  upVotes: number;
  downVotes: number;
  createdAt: Date;
}

interface SigninWithOAuthProps {
  user: {
    name?: string;
    email?: string;
    username?: string;
    image?: string;
  };
  provider: string;
  providerAccountId: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}

interface GetTagQuestionParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

interface IncrementViewsParams {
  questionId: string;
}

interface CreateAnswerParams {
  questionId: string;
  content: string;
}

interface GetAnswersParams extends PaginatedSearchParams {
  questionId: string;
}

interface CreateVoteCountParams {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

interface UpdateVotecountParams extends CreateVoteCountParams {
  change: -1 | 1;
}

type HasVotedParams = Omit<CreateVoteCountParams, "voteType">;

interface HasVotedResponse {
  hasUpvoted: boolean;
  hasDownVoted: boolean;
}
