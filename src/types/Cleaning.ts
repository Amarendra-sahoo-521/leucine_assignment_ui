export interface Cleaning {
  id: number;
  cleanedBy: string;
  cleanedAt: string;
  method: string;
  notes: string;
  status: "pending" | "verified";
  createdAt: string;
  updatedAt: string;
}

export interface Audit {
  id: number;
  changed_by: string;
  changed_at: string;
  field_name: string;
  old_value: string;
  new_value: string;
  createdAt: string;
  updatedAt: string;
}

export interface Response {
  id: number;
  cleanedBy: string;
  cleanedAt: string;
  method: string;
  notes: string;
  status: "pending" | "verified";
  createdAt: string;
  updatedAt: string;
  audit:Audit;
}

export interface CleaningPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CleaningResponse {
  data: Cleaning[];
  pagination: CleaningPagination;
  status: boolean;
  message: string;
}

export interface AuditResponse {
  data: Response;
  status: boolean;
  message: string;
}