// @ts-nocheck
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { HeaderPortal } from "@/pages/_page/HeaderPortal";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/widgets/data-table/DataTable";
import { columns } from "./components/columns";
import { DataTableFilter } from "./components/DataTableFilter";

import { getTimeEntries } from "@/api/clockify/timeEntries";
import {
  AddTimeEntryDialog,
  ADD_TIME_ENTRY_DIALOG,
} from "./components/AddTimeEntryDialog";
import { dialogActions } from "@/zustand/useDialogStore";
import { EditTimeEntryDialog } from "./components/EditTimeEntryDialog";

export const TimeEntryList = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "_id", desc: false },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    projectId: "",
    taskId: "",
  });

  const { data: timeEntries } = useQuery({
    queryKey: ["clockifyTimeEntries", filters, sorting],
    queryFn: async () => {
      const res = await getTimeEntries({
        ...filters,
        sorting: sorting.map((s) => (s.desc ? "-" : "") + s.id).join(","),
      });

      return res;
    },
  });

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Time Entries</h1>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              dialogActions.openDialog(ADD_TIME_ENTRY_DIALOG);
            }}
          >
            New
          </Button>
        </div>
      </HeaderPortal>
      <div className="p-4 flex flex-col gap-4">
        <DataTable
          columns={columns}
          data={timeEntries || []}
          filter={<DataTableFilter filters={filters} setFilters={setFilters} />}
          sorting={sorting}
          setSorting={setSorting}
          columnVisibility={{
            _id: false,
          }}
          pagination={pagination}
          setPagination={setPagination}
        />
        <AddTimeEntryDialog />
        <EditTimeEntryDialog />
      </div>
    </div>
  );
};
