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
import { EDIT_USER_DIALOG_ID } from "./EditUserDialog";
import { setDialogOpen } from "@/redux/slices/dialogs";
import { deleteUser, getUsers, updateUser } from "@/api/users";
// import { DataTableFilter } from "./DataTableFilter";
import {
  DELETE_CONFIRMATION_DIALOG,
  DeleteConfirmationDialog,
} from "@/pages/admin/expensify/expenses/_page/components/DeleteConfirmationDialog";

export const DataTable: React.FC = ({ columns }: any) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsers();
      return res;
    },
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
            id: EDIT_USER_DIALOG_ID,
            open: true,
            dialogData: {
              user: row.original,
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

      toggleActive: async (row, checked) => {
        try {
          await updateUser(row.original.id, {
            status: checked ? "active" : "inactive",
          });

          queryClient.invalidateQueries(["users"]);
          toast.success("User updated");
        } catch (error) {
          console.error(error);
          toast.error("Error updating user");
        }
      },
    },
  });

  const handleDelete = async (dialogData) => {
    try {
      const resp = await deleteUser(dialogData.id);

      queryClient.invalidateQueries(["users"]);
      if (resp) {
        toast.success("User deactivated");
      } else {
        toast.success("User deleted");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <DeleteConfirmationDialog
        title="Are you sure you want to delete this user?"
        onConfirm={handleDelete}
      />

      {/* <DataTableFilter filters={filters} setFilters={setFilters} /> */}
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
