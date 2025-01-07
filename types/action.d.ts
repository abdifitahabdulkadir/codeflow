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
