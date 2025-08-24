// @ts-nocheck
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Menu } from "lucide-react";

import { formatPrice } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef[] = [
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Category" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.category?.name}</span>;
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total" />;
    },
    cell: ({ row }) => <span>{formatPrice(row.original.total)}</span>,
  },
  {
    accessorKey: "expenses",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="# Of Expenses" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.count}</span>;
    },
  },
  {
    accessorKey: "average",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Average" />;
    },
    cell: ({ row }) => <span>{formatPrice(row.original.average)}</span>,
  },
  {
    id: "raw",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="View Raw Data"
          className="text-right"
        />
      );
    },
    cell: ({ row, table }) => (
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            table.options.meta?.handleOpen(row);
          }}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
