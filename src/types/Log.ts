export interface Log {
  id: number;
  message: string;
  createdAt: string;
  user: {
    username: string;
  };
}