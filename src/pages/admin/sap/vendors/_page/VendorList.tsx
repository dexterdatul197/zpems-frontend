// @ts-nocheck
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { HeaderPortal } from "@/pages/_page/HeaderPortal";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/widgets/data-table/DataTable";
import { columns } from "./components/columns";
// import { DataTableFilter } from "./components/DataTableFilter";

import { getVendors } from "@/api/sap/vendors";
import {
  AddVendorDialog,
  ADD_VENDOR_DIALOG,
} from "./components/AddVendorDialog";
import { dialogActions } from "@/zustand/useDialogStore";

export const VendorList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState({
    // dateFrom: "",
    // dateTo: "",
  });

  const { data: vendors } = useQuery({
    queryKey: ["sapVendors", filters, sorting],
    queryFn: async () => {
      const res = await getVendors({
        ...filters,
        sorting: sorting.map((s) => (s.desc ? "-" : "") + s.id).join(","),
      });

      return res;
    },
  });

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Vendors</h1>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              dialogActions.openDialog(ADD_VENDOR_DIALOG);
            }}
          >
            New
          </Button>
        </div>
      </HeaderPortal>
      <div className="p-4 flex flex-col gap-4">
        <DataTable
          columns={columns}
          data={vendors || []}
          //   filter={<DataTableFilter filters={filters} setFilters={setFilters} />}
          sorting={sorting}
          setSorting={setSorting}
          columnVisibility={{
            _id: false,
          }}
          //   pagination={pagination}
          //   setPagination={setPagination}
        />
        <AddVendorDialog />
      </div>
    </div>
  );
};
