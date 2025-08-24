// @ts-nocheck
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import moment from "moment-timezone";

import { settingsActions } from "@/zustand/useSettingsStore";
import { dialogActions } from "@/zustand/useDialogStore";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "@/components/widgets/data-table/DataTableColumnHeader";
import { useNavigate } from "react-router-dom";

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
    accessorKey: "contactName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Contact Name" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.user.name}</span>;
    },
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Company Name" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.companyName}</span>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.user.email}</span>;
    },
  },

  // {
  //   id: "actions",
  //   cell: ({ row, table }) => {
  //     return (
  //       <div className="flex gap-2">
  //         <Button variant="default" onClick={() => {}}>
  //           Edit
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
