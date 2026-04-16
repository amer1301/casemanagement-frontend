export type Note = {
  id: number;
  text: string;
  createdAt: string;
  user?: {
    name: string;
  };
};