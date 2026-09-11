
import { useMutation,useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createEquipment,
  updateEquipment,
  EquipmentPayload,getEquipments, GetEquipmentsParams,
  deleteEquipment
} from "../api/equipmentApi";

export const useEquipments = (params: GetEquipmentsParams = {}) => {
  const { page = 1, limit = 10, active } = params;

  return useQuery({
    queryKey: ["equipments", page, limit, active],
    queryFn: () => getEquipments(params),
  });
};

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EquipmentPayload) => createEquipment(payload),
    onSuccess: () => {
      toast.success("Equipment created successfully");
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create equipment");
    },
  });
};

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: EquipmentPayload;
    }) => updateEquipment(id, payload),
    onSuccess: () => {
      toast.success("Equipment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update equipment");
    },
  });
};

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id}: {
      id: string | number;
    }) => deleteEquipment(id),
    onSuccess: () => {
      toast.success("Equipment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to delete equipment");
    },
  });
};