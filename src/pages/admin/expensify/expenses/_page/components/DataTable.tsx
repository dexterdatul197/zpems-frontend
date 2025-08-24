// @ts-nocheck
import React from "react";
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
import { DataTableFilter } from "./DataTableFilter";
import { DataTablePagination } from "./DataTablePagination";
import { EDIT_EXPENSE_DIALOG_ID } from "./EditExpenseDialog";
import { setDialogOpen } from "@/redux/slices/dialogs";
import { deleteExpense } from "@/api/expenses";
import {
  DELETE_CONFIRMATION_DIALOG,
  DeleteConfirmationDialog,
} from "./DeleteConfirmationDialog";

export const DataTable: React.FC = ({
  data,
  pageCount,
  columns,
  categories,

  pagination,
  sorting,
  filters,
  setPagination,
  setSorting,
  setFilters,
}: any) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const table = useReactTable({
    data: data ?? [],
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,

    meta: {
      openEditDialog: (row) => {
        dispatch(
          setDialogOpen({
            id: EDIT_EXPENSE_DIALOG_ID,
            open: true,
            dialogData: {
              expense: row.original,
            },
          })
        );
      },
      handleDelete: async (row) => {
        dispatch(
          setDialogOpen({
            id: DELETE_CONFIRMATION_DIALOG,
            open: true,
            dialogData: row.original,
          })
        );
      },
    },
  });

  const handleDelete = async (dialogData) => {
    try {
      await deleteExpense(dialogData?._id);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense removed");
    } catch (error) {
      console.error(error);
      toast.error("Error removing expense");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <DeleteConfirmationDialog
        title="Are you sure you want to delete this expense?"
        onConfirm={handleDelete}
      />
      <DataTableFilter
        filters={filters}
        setFilters={setFilters}
        categories={categories}
      />
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
      <DataTablePagination table={table} />
    </div>
  );
};
