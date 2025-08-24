import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "./DataTablePagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableProps = {
  data: any[];
  columns: any[];
  filter: React.ReactNode;
  columnVisibility?: any;
  sorting: any;
  setSorting: any;
  pagination: any;
  setPagination: any;
};

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  filter,
  columnVisibility = {},
  sorting,
  setSorting,
  pagination,
  setPagination,
}) => {
  const tableOptions: any = {
    data,
    columns,
    pageCount: 1,
    state: {
      sorting,
    },
    initialState: {
      columnVisibility,
    },

    getCoreRowModel: getCoreRowModel(),

    manualSorting: true,
    onSortingChange: setSorting,

    manualPagination: true,
    // onPaginationChange: setPagination,

    meta: {},
  };

  if (pagination && setPagination) {
    tableOptions.manualPagination = true;
    tableOptions.onPaginationChange = setPagination;
    tableOptions.state.pagination = pagination;
  }
  const table = useReactTable(tableOptions);

  return (
    <div className="flex flex-col gap-2">
      {filter}
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
                <TableCell colSpan={10}>
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

      {pagination && setPagination && <DataTablePagination table={table} />}
    </div>
  );
};
