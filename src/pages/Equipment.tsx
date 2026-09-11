import { memo, useState } from "react";
import { useDeleteEquipment, useEquipments } from "../hooks/useEquipments";
import { DataTable, Column } from "@/components/common/data-table";
import { VscOpenPreview } from "react-icons/vsc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirmation-dialog";
import { RiDeleteBin5Line } from "react-icons/ri";
import { EquipmentFormDialog } from "@/components/forms/equipment_form";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Equipment {
  id: string | number;
  name: string;
  code: string;
  status: "active" | "inactive";
  createdAt: string;
}

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "retired", value: "inactive" },
];

function Equipment() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string>("all");
  const deleteMutation = useDeleteEquipment();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useEquipments({
    page,
    limit,
    active: status === "all" ? undefined : status === "active",
  });

  const handelDelete = (id: number) => {
    deleteMutation.mutateAsync({ id });
  };

  const handelDetailsPageLoad = (row: Equipment) => {
    navigate("/cleaning", { state: row });
  };

  const columns: Column<Equipment>[] = [
    {
      key: "sl",
      header: "#",
      render: (_row, index) => (page - 1) * limit + index + 1,
    },
    {
      key: "name",
      header: "Name",
    },
    {
      key: "code",
      header: "Code",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <p
          className={`font-semibold capitalize ${
            row.status === "active" ? "text-green-400" : "text-red-400"
          }`}
        >
          {row.status}
        </p>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-60 whitespace-nowrap ",
      render: (row: any) => (
        <div className="flex  items-center gap-1 whitespace-nowrap">
          <Button
            className={"cursor-pointer"}
            title="View Details"
            variant="ghost"
            onClick={() => handelDetailsPageLoad(row)}
          >
            <VscOpenPreview />
          </Button>

          <EquipmentFormDialog
            mode="edit"
            equipment={row}
            trigger={
              <Button
                variant="ghost"
                title="Edit Equipment"
                className={"cursor-pointer"}
              >
                <FaRegEdit />
              </Button>
            }
          />

          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                title="Delete Equipment"
                size="icon"
                className={"cursor-pointer"}
              >
                <RiDeleteBin5Line className="text-red-400 font-semibold" />
              </Button>
            }
            title="Delete Equipment"
            description="Are you sure you want to delete this equipment? This action cannot be undone."
            confirmLabel="Delete"
            // cancelLabel="Cancel"
            onConfirm={() => handelDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Equipment</h1>
        <EquipmentFormDialog
          mode="create"
          trigger={
            <Button className={"cursor-pointer"}>+ Add Equipment</Button>
          }
        />
      </div>
      <DataTable
        columns={columns}
        data={data?.data}
        rowKey={(row: any) => row.id}
        isLoading={isLoading}
        isError={isError}
        error={error}
        pagination={{
          page,
          limit,
          total: data?.pagination.total ?? 0,
          totalPages: data?.pagination.totalPages ?? 1,
        }}
        onPageChange={setPage}
        onLimitChange={(l: any) => {
          setLimit(l);
          setPage(1);
        }}
        toolbar={
          <Select
            value={status}
            onValueChange={(val: any) => {
              setStatus(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}

export default Equipment;
