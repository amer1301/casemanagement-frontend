export interface Log {
  id: number;
  action: string;
  timestamp: string;
  user: {
    username: string;
  };
}