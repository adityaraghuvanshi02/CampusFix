export type IssueCategory =
  | 'Electricity'
  | 'Plumbing'
  | 'Furniture'
  | 'Cleanliness'
  | 'Internet'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Complaint {
  id: string;
  studentName: string;
  studentEmail: string;
  location: string;
  category: IssueCategory;
  priority: Priority;
  description: string;
  status: ComplaintStatus;
  createdAt: number;
  isDemo?: boolean;
}

export const CATEGORIES: IssueCategory[] = [
  'Electricity',
  'Plumbing',
  'Furniture',
  'Cleanliness',
  'Internet',
  'Other',
];

export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];

export const STATUSES: ComplaintStatus[] = ['Pending', 'In Progress', 'Resolved'];

export const CAMPUS_LOCATIONS = [
  'Classroom 204',
  'Computer Lab',
  'Library',
  'Cafeteria',
  'Block A Washroom',
];
