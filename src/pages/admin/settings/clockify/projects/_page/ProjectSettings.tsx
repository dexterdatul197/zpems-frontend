//@ts-nocheck
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/widgets/data-table/DataTable";
import { columns } from "./components/columns";

import { HeaderPortal } from "@/pages/_page/HeaderPortal";

import { getProjects, syncProjects } from "@/api/clockify/projects";
import { useState } from "react";

export const ProjectSettings = () => {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "_id", desc: false },
  ]);

  const { data: projects } = useQuery({
    queryKey: ["clockifySettingProjects", sorting],
    queryFn: async () => {
      return await getProjects({
        sorting: sorting.map((s) => (s.desc ? "-" : "") + s.id).join(","),
      });
    },
  });

  const mutation = useMutation({ mutationFn: syncProjects });

  const handleSync = async () => {
    try {
      const resp = await mutation.mutateAsync();
      toast.success(resp.message);
      queryClient.invalidateQueries(["projects"]);
    } catch (error) {
      console.error(error);
      toast.error("Error syncing projects");
    }
  };

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Projects</h1>
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
          data={projects || []}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
    </div>
  );
};
