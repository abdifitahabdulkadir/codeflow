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

interface SigninWithOAuthProps {
  user: {
    name?: string;
    email?: string;
    username?: string;
  };
  provider: string;
  providerAccountId: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}
interface GetQuestionParams {
  questionId: string;
}
