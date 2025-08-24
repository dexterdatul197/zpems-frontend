// @ts-nocheck
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/widgets/data-table/DataTableColumnHeader";
import { EDIT_TASK_DIALOG } from "./EditTaskDialog";
import { dialogActions } from "@/zustand/useDialogStore";

export const columns: ColumnDef[] = [
  //   {
  //     accessorKey: "_id",
  //     header: ({ column }) => {
  //       return <DataTableColumnHeader column={column} title="ID" />;
  //     },
  //     cell: ({ row }) => {
  //       return <span>{row.original._id}</span>;
  //     },
  //   },

  {
    accessorKey: "internalId",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Internal ID" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.internalId}</span>;
    },
  },
  {
    accessorKey: "client-name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Client" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.client?.name}</span>;
    },
  },
  {
    accessorKey: "project-name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Project" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.project?.name}</span>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.name}</span>;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Description" />;
    },
    cell: ({ row }) => {
      return (
        <span>
          {row.original.description?.length > 50
            ? row.original.description.substring(0, 50) + "..."
            : row.original.description}
        </span>
      );
    },
  },
  {
    accessorKey: "assignees",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Assignees" />;
    },
    cell: ({ row }) => {
      return (
        <span>
          {row.original.assignees?.map((user) => user.name).join(", ")}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={() => {
            dialogActions.openDialog(EDIT_TASK_DIALOG, row.original);
          }}
        >
          Edit
        </Button>
        {/* <Button
          variant="destructive"
          onClick={() => {
            table.options.meta?.handleDelete(row);
          }}
        >
          Remove
        </Button> */}
      </div>
    ),
  },
];
