// @ts-nocheck
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";

import { HeaderPortal } from "@/pages/_page/HeaderPortal";
import { getWeeklyTimesheets } from "@/api/clockify/weeklyTimesheets";

import { DataTable } from "@/components/widgets/data-table/DataTable";
import { columns } from "./components/columns";
import { DataTableFilter } from "./components/DataTableFilter";

export const WeeklyTimesheetList = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "_id", desc: false },
  ]);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
  });

  const { data: weeklyTimesheets, isLoading } = useQuery({
    queryKey: ["clockifyWeeklyTimesheets", filters, sorting],
    queryFn: async () => {
      const res = await getWeeklyTimesheets({
        ...filters,
        sorting: sorting.map((s) => (s.desc ? "-" : "") + s.id).join(","),
      });
      return res;
    },
  });

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Weekly Timesheets</h1>
      </HeaderPortal>
      <div className="p-4 flex flex-col gap-4">
        <DataTable
          columns={columns}
          data={weeklyTimesheets || []}
          filter={<DataTableFilter filters={filters} setFilters={setFilters} />}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
    </div>
  );
};
