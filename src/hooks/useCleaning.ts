import { CleaningPayload, CleaningUpdatePayload, createCleaning, getAudit, getCleaning, GetCleaningParams, updateCleaning } from "@/api/cleaningApi";
import { useMutation,useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCleaning = (id:number,params: GetCleaningParams = {}) => {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["cleaning", page, limit,],
    queryFn: () => getCleaning(id,params),
  });
};

export const useAudit = (id:number) => {
  return useQuery({
    queryKey: ["audit",id],
    queryFn: () => getAudit(id),
  });
};

export const useCreateCleaning = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CleaningPayload) => createCleaning(payload),
    onSuccess: () => {
      toast.success("Cleaning log created successfully");
      queryClient.invalidateQueries({ queryKey: ["cleaning"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create cleaning log");
    },
  });
};

export const useUpdateCleaning = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: CleaningUpdatePayload }) =>
      updateCleaning(id, payload),
    onSuccess: () => {
      toast.success("Cleaning log updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cleaning"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update cleaning log");
    },
  });
};