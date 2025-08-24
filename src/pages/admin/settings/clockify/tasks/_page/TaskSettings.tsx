//@ts-nocheck
import { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/widgets/data-table/DataTable";
import { columns } from "./components/columns";

import { HeaderPortal } from "@/pages/_page/HeaderPortal";

import { getTasks, syncTasks } from "@/api/clockify/tasks";
import { DataTableFilter } from "./components/DataTableFilter";

import { EditTaskDialog } from "./components/EditTaskDialog";

export const TaskSettings = () => {
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "_id", desc: false },
  ]);

  const [filters, setFilters] = useState({
    projectInternalId: "",
    clientInternalId: "",
  });

  const { data: tasks } = useQuery({
    queryKey: ["clockifyTasksSetting", filters, sorting],
    queryFn: async () => {
      return await getTasks({
        ...filters,
        sorting: sorting.map((s) => (s.desc ? "-" : "") + s.id).join(","),
      });
    },
  });

  const mutation = useMutation({ mutationFn: syncTasks });
  const handleSync = async () => {
    try {
      const resp = await mutation.mutateAsync();
      toast.success(resp.message);
      queryClient.invalidateQueries(["clockifyTasksSetting"]);
    } catch (error) {
      console.error(error);
      toast.error("Error syncing tasks");
    }
  };

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Tasks</h1>
        <div className="flex gap-2">
          <Button onClick={handleSync} disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sync
          </Button>
        </div>
      </HeaderPortal>
      <div className="p-4">
        <DataTable
          columns={columns}
          data={tasks || []}
          filter={<DataTableFilter filters={filters} setFilters={setFilters} />}
          sorting={sorting}
          setSorting={setSorting}
        />
        <EditTaskDialog />
      </div>
    </div>
  );
};
