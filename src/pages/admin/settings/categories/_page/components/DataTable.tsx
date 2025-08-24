// @ts-nocheck
import React from "react";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
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
import { EDIT_CATEGORY_DIALOG_ID } from "./EditCategoryDialog";
import { setDialogOpen } from "@/redux/slices/dialogs";
import {
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/api/categories";

export const DataTable: React.FC = ({ columns }: any) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    state: {},

    meta: {
      openEditDialog: (row) => {
        dispatch(
          setDialogOpen({
            id: EDIT_CATEGORY_DIALOG_ID,
            open: true,
            dialogData: {
              category: row.original,
            },
          })
        );
      },

      handleDelete: async (row) => {
        try {
          await deleteCategory(row.original._id);

          queryClient.invalidateQueries(["categories"]);
          toast.success("Category removed");
        } catch (error) {
          console.error(error);
          toast.error("Error removing category");
        }
      },

      // getAllActive: () => {
      //   return data.every(({ status }) => status === "active");
      // },

      // toggleAllActive: (value) => {
      // },

      toggleActive: async (row, checked) => {
        try {
          await updateCategory(row.original._id, {
            status: checked ? "active" : "inactive",
          });

          queryClient.invalidateQueries(["categories"]);
          toast.success("Category updated");
        } catch (error) {
          console.error(error);
          toast.error("Error updating category");
        }
      },
    },
  });

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
