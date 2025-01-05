interface SigninWithOAuthProps {
  user: {
    name?: string;
    email?: string;
    username?: string;
  };
  provider: string;
  providerAccountId: string;
}

interface CreateQuestionProps {
  title: string;
  content: string;
  tags: string[];
}
