import { EquipmentResponse } from "@/types/Equipments";
import api from "./axios";

export interface GetEquipmentsParams {
  page?: number;
  limit?: number;
  active?: boolean;
}
export interface EquipmentPayload {
  name: string;
  code: string;
  status: "active" | "retired";
}

export const getEquipments = async (
  params: GetEquipmentsParams = {}
): Promise<EquipmentResponse> => {
  const { page = 1, limit = 10, active } = params;

  const response = await api.get("/equipments/", {
    params: {
      page,
      limit,
      ...(active !== undefined ? { active } : {}),
    },
  });

  return response.data;
};

export const createEquipment = async (payload: EquipmentPayload) => {
  const response = await api.post("/equipments/create", payload);
  return response.data;
};

export const updateEquipment = async (
  id: string | number,
  payload: EquipmentPayload
) => {
  const response = await api.put(`/equipments/${id}`, payload); 
  return response.data;
};

export const deleteEquipment = async (
  id: string | number
) => {
  const response = await api.delete(`/equipments/${id}`); 
  return response.data;
};