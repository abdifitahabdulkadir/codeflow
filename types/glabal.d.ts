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
