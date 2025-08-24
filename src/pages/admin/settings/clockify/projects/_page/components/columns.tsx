// @ts-nocheck
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
// import { Trash2Icon } from "lucide-react";
// import moment from "moment-timezone";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "@/components/widgets/data-table/DataTableColumnHeader";
// import { useNavigate } from "react-router-dom";

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
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.name}</span>;
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
];
