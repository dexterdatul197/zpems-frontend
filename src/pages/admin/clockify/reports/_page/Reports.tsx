// @ts-nocheck
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeaderPortal } from "@/pages/_page/HeaderPortal";

import { getTimeReports } from "@/api/clockify/timeEntries";

import { Filter } from "./components/Filter";
import { BarChart } from "./components/BarChart";

export const Reports = () => {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
  });

  const { data: timeReports, isLoading } = useQuery({
    queryKey: ["clockifyTimeEntries", filters],
    queryFn: async () => {
      const res = await getTimeReports({ ...filters });

      return res;
    },
  });

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Time Reports</h1>
      </HeaderPortal>
      <div className="p-4 flex flex-col gap-4">
        <Filter filters={filters} setFilters={setFilters} />
        <BarChart
          timeReports={timeReports}
          startDate={filters.dateFrom}
          endDate={filters.dateTo}
        />
      </div>
    </div>
  );
};
