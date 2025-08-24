//@ts-nocheck
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useClockifyTrackStore } from "../zustand/useClockifyTrackStore";

export const DataTable: React.FC = ({ columns }: any) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { lineTimesheets, addEmptyLineTimesheet, getTotalsPerDay } =
    useClockifyTrackStore();

  const table = useReactTable({
    data: lineTimesheets,
    columns,
    pageCount: 1,
    state: {},
    initialState: {
      columnVisibility: {
        id: false,
        rowId: false,
      },
    },

    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,

    meta: {},
  });

  const handleAddNewRow = () => {
    addEmptyLineTimesheet();
  };

  return (
    <div className="flex flex-col gap-2">
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

            {/* total row */}
            <TableRow>
              <TableCell colSpan={2} className="text-left">
                <Button onClick={handleAddNewRow} className="w-[200px]">
                  Add a new row
                </Button>
              </TableCell>
              {getTotalsPerDay().map((total) => (
                <TableCell key={total.date} className="text-center">
                  <span>{total} hours</span>
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
