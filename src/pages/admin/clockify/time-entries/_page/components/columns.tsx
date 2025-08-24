// @ts-nocheck
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment-timezone";

import { settingsActions } from "@/zustand/useSettingsStore";
import { dialogActions } from "@/zustand/useDialogStore";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/widgets/data-table/DataTableColumnHeader";

import { EDIT_TIME_ENTRY_DIALOG } from "./EditTimeEntryDialog";

export const columns: ColumnDef[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Id" />;
    },
    cell: ({ row }) => {
      return <span>{row.original._id}</span>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Date" />;
    },
    cell: ({ row }) => {
      return (
        <span>
          {moment(row.original.date).format(settingsActions.getDateFormat())}
        </span>
      );
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Project" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.project?.name}</span>;
    },
  },
  {
    accessorKey: "task",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Task" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.task?.name}</span>;
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Duration" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.duration}</span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => {
              dialogActions.openDialog(EDIT_TIME_ENTRY_DIALOG, row.original);
            }}
          >
            Edit
          </Button>
        </div>
      );
    },
  },
];
