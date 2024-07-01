export interface Task {
  id: string;
  uid: string | undefined;
  task: string;
  completed: boolean;
  createdAt: number;
  concludedAt: number | null;
}