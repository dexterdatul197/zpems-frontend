//@ts-nocheck
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import qs from "qs";

import { getExpensesGroup } from "@/api/expenses";
import { Category } from "@/lib/types";
import { setDialogOpen } from "@/redux/slices/dialogs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart } from "./Chart";
import { DataTableFilter } from "./DataTableFilter";
import { EXPENSES_GROUP_DIALOG_ID } from "./ExpensesGroupDialog";

import { DEFAULT_VALUES as FILTER_DEFAULT_VALUES } from "./DataTableFilter";

interface DataTableProps {
  columns: ColumnDef[];
  categories: Category[];
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  categories,
}) => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(FILTER_DEFAULT_VALUES);

  const { data, isLoading } = useQuery({
    queryKey: ["expensesGroup", filters],
    queryFn: async () => {
      return await getExpensesGroup(filters);
    },
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),

    meta: {
      handleOpen: (row) => {
        dispatch(
          setDialogOpen({
            id: EXPENSES_GROUP_DIALOG_ID,
            open: true,
            dialogData: {
              id: row.original._id,
              expenses: row.original.expenses,
            },
          })
        );
      },
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <DataTableFilter filters={filters} setFilters={setFilters} />

      {!isLoading && <PieChart groups={data} categories={categories} />}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex justify-center items-center">
                    No data
                  </div>
                </TableCell>
              </TableRow>
            )}

            {table.getRowModel().rows.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
