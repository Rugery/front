export interface IProgress {
  id: number;
  userId: number;
  courseId: number;
  completed: boolean;
  dateCompleted?: string;
  courseTitle: string;
  status?: string;
}
