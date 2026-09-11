export interface Equipment {
  id: number;
  name: string;
  code: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EquipmentResponse {
  data: Equipment[];
  pagination: EquipmentPagination;
  status: boolean;
  message: string;
}