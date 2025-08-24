// @ts-nocheck
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";

import { HeaderPortal } from "@/pages/_page/HeaderPortal";

import { DataTable } from "@/components/widgets/data-table/DataTable";
import { columns } from "./components/columns";

import { getClients } from "@/api/clockify/clients";

export const ClientSettings = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "_id", desc: false },
  ]);

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clockifySettingClients", sorting],
    queryFn: async () => {
      return await getClients({
        sorting: sorting.map((s) => (s.desc ? "-" : "") + s.id).join(","),
      });
    },
  });

  // const mutation = useMutation({ mutationFn: syncClients });
  // const handleSync = async () => {
  //   try {
  //     const resp = await mutation.mutateAsync();
  //     toast.success(resp.message);
  //     queryClient.invalidateQueries(["clients"]);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Error syncing clients");
  //   }
  // };

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Clients</h1>
        <div className="flex gap-2">
          {/* <Button onClick={handleSync} disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sync
          </Button> */}
        </div>
      </HeaderPortal>
      {!isLoading && (
        <div className="p-4">
          <DataTable
            columns={columns}
            data={clients || []}
            sorting={sorting}
            setSorting={setSorting}
          />
        </div>
      )}
    </div>
  );
};
