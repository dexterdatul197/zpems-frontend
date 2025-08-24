// @ts-nocheck
import React, { useEffect, useState } from "react";
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
import { DataTablePagination } from "./DataTablePagination";
import { EDIT_EXPENSE_REPORT_DIALOG_ID } from "./EditExpenseReportDialog";
import { setDialogOpen } from "@/redux/slices/dialogs";
import { deleteExpenseReport, submitExpenseReport } from "@/api/expenseReports";
import { DataTableFilter } from "./DataTableFilter";

import {
  DELETE_CONFIRMATION_DIALOG,
  DeleteConfirmationDialog,
} from "@/pages/admin/expensify/expenses/_page/components/DeleteConfirmationDialog";

export const DataTable: React.FC = ({
  data: _data,
  columns,
  pagination,
  setPagination,
  sorting,
  setSorting,
  filters,
  setFilters,
  pageCount,
}: any) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [data, setData] = useState(_data);

  useEffect(() => {
    setData(_data);
  }, [_data]);

  const table = useReactTable({
    data: data,
    columns,
    pageCount: pageCount,
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
      handleSubmitReport: async (row) => {
        setData((prev) => {
          return prev.map((item) => {
            if (item._id === row.original._id) {
              return {
                ...item,
                isSending: true,
              };
            }

            return item;
          });
        });

        try {
          const data = await submitExpenseReport(row.original._id);
          console.log(data);

          queryClient.invalidateQueries(["expenseReports"]);
          toast.success("Expense Report submitted");
        } catch (error) {
          console.error(error.response.data);
          const resp = error.response.data;

          let errorDetail = "";
          try {
            errorDetail =
              error.message + " - " + resp.error["o:errorDetails"][0].detail;
          } catch (error) {
            errorDetail = error.message;
          }

          toast.error("Error sending expense report", {
            description: errorDetail,
          });
        }

        setData((prev) => {
          return prev.map((item) => {
            if (item._id === row.original._id) {
              return {
                ...item,
                isSending: false,
              };
            }

            return item;
          });
        });
      },

      openEditDialog: (row) => {
        dispatch(
          setDialogOpen({
            id: EDIT_EXPENSE_REPORT_DIALOG_ID,
            open: true,
            dialogData: {
              expenseReport: row.original,
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
      await deleteExpenseReport(dialogData?._id);

      queryClient.invalidateQueries(["expenseReports"]);
      toast.success("Expense Report removed");
    } catch (error) {
      console.error(error);
      toast.error("Error removing expense report");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <DeleteConfirmationDialog
        title="Are you sure you want to delete this expense report?"
        onConfirm={handleDelete}
      />

      <DataTableFilter filters={filters} setFilters={setFilters} />
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
                <TableCell colSpan={3}>
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
