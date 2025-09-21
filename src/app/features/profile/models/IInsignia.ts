import { ICourse } from '../../adminModule/admin-course-service';

export interface IInsignia {
  id: number;
  userId: number;
  name: string;
  description: string;
  dateAwarded: string;
  imageUrl: string;
}
