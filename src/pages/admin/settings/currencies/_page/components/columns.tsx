// @ts-nocheck
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon, Loader2Icon } from "lucide-react";
import moment from "moment-timezone";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Switch } from "@/components/ui/switch";

import { priceFormat } from "utils/l10n";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef[] = [
  {
    id: "active",
    header: ({ table }) => {
      const { getAllActive, toggleAllActive } = table.options.meta;
      return (
        <></>
        // <Switch
        //   checked={getAllActive()}
        //   onCheckedChange={(checked) => toggleAllActive(checked)}
        //   aria-label="Check all"
        // />
      );
    },
    cell: ({ row, table }) => {
      const { toggleActive } = table.options.meta;
      return (
        <Switch
          checked={row.original.status === "active"}
          onCheckedChange={(checked) => toggleActive(row, checked)}
          aria-label="Check row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "internalId",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Internal ID" />;
    },
    cell: ({ row }) => <span>{row.original.internalId}</span>,
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Symbol" />;
    },
    cell: ({ row }) => <span>{row.original.symbol}</span>,
  },

  {
    id: "actions",
    cell: ({ row, table }) => (
      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={() => {
            table.options.meta?.openEditDialog(row);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            table.options.meta?.handleDelete(row);
          }}
        >
          Remove
        </Button>
      </div>
    ),
  },
];
