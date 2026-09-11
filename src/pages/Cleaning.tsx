import { Column, DataTable } from "@/components/common/data-table";
import { useCleaning } from "@/hooks/useCleaning";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Cleaning } from "@/types/Cleaning";
import { CustomHoverCard } from "@/components/common/custom-hover-card";
import { Button } from "@/components/ui/button";
import { VscOpenPreview } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";
import { CleaningFormDialog } from "@/components/forms/cleaning_form";

function Cleaning() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const equipment = location.state;
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useCleaning(equipment?.id, {
    page,
    limit,
  });
  
  const handelDetailsPageLoad = (row: Cleaning) => {
    navigate('/audit', { state: { id: row.id } });
  };

  const columns: Column<Cleaning>[] = [
    {
      key: "sl",
      header: "#",
      render: (_row, index) => (page - 1) * limit + index + 1,
    },
    {
      key: "cleanedBy",
      header: "Cleaned By",
    },
    {
      key: "method",
      header: "Method",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <p
          className={`font-semibold capitalize ${
            row.status === "verified" ? "text-green-400" : "text-red-400"
          }`}
        >
          {row.status}
        </p>
      ),
    },
    {
      key: "cleanedAt",
      header: "Cleaned At",
      className: "w-40 ",
      render:(row)=>(
        <p>{row.cleanedAt.trim() && new Date(row.cleanedAt).toDateString()}</p>
      )
    },
    {
      key: "notes",
      header: "Notes",
      className: "w-px ",
      render: (row) => (
        <CustomHoverCard trigger={<p className="w-40 truncate">{row.notes}</p>}>
          <div className="space-y-2">
            <div>{row.notes}</div>
          </div>
        </CustomHoverCard>
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
            title="View Audit"
            variant="ghost"
            onClick={() => handelDetailsPageLoad(row)}
          >
            <VscOpenPreview />
          </Button>

          <CleaningFormDialog
            mode="edit"
            cleaning={row}
            eqId={equipment?.id}
            trigger={
              <Button
                variant="ghost"
                title="Edit Cleaning"
                className={"cursor-pointer"}
              >
                <FaRegEdit />
              </Button>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="px-6">

      <div className="w-full my-5 min-h-4">
       <h1 className="text-2xl font-bold">Equipment</h1>

       <div className="flex gap-20 mt-2">
        <p className="font-semibold">Name: <span className="capitalize">{equipment.name}</span></p>
        <p className="font-semibold">Code: <span className="capitalize">{equipment.code}</span></p>
        <p className="font-semibold">Status: <span className="capitalize">{equipment.status}</span></p>
        </div>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cleanings</h1>
        <CleaningFormDialog
          mode="create"
          eqId={equipment?.id}
          trigger={<Button className={"cursor-pointer"}>+ Add Cleaning</Button>}
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
      />
    </div>
  );
}

export default Cleaning;
