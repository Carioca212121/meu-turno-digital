export interface WorkRecord {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  createdBy: string; // Username de quem criou o registro
}