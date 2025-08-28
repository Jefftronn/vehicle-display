export interface SavedList {
  id?: number;
  name: string;
  description: string;
  createdAt?: Date;
  createdBy?: string;
  carIds?: number[];  // store IDs, not full objects
}