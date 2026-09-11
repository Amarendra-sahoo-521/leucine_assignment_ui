import { AuditResponse, CleaningResponse } from "@/types/Cleaning";
import api from "./axios";

export interface GetCleaningParams {
  page?: number;
  limit?: number;
}

export interface CleaningPayload {
  cleanedBy: string;
  cleanedAt: string; // ISO date string
  method: string;
  notes: string;
  status: "pending" | "verified";
  eq_id: string | number;
}

export interface CleaningUpdatePayload {
  cleanedBy: string;
  cleanedAt: string;
  method: string;
  notes: string;
  status: "pending" | "verified";
  changed_by: string ;
}


export const getCleaning = async (id:number,
  params: GetCleaningParams = {}
): Promise<CleaningResponse> => {
  const { page = 1, limit = 10 } = params;

  const response = await api.get(`/cleaning/${id}`, {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const getAudit = async (id:number): Promise<AuditResponse> => {
 
  const response = await api.get(`/cleaning/get_record/${id}`)

  return response.data;
};



export const createCleaning = async (payload: CleaningPayload) => {
  const response = await api.post("/cleaning/create", payload);
  return response.data;
};

export const updateCleaning = async (
  id: string | number,
  payload: CleaningUpdatePayload
) => {
  const response = await api.patch(`/cleaning/${id}`, payload); 
  return response.data;
};