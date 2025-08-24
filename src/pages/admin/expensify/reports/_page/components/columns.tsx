// @ts-nocheck
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon, Loader2Icon } from "lucide-react";
import moment from "moment-timezone";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

import { priceFormat } from "utils/l10n";
import { useSettings } from "@/hooks/useSettings";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Report Name" />;
    },
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Date" />;
    },
    cell: ({ row }) => {
      const { settings } = useSettings();

      return (
        <span>{moment(row.original.date).format(settings?.dateFormat)}</span>
      );
    },
  },
  {
    accessorKey: "tranId",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Tran Id" />;
    },
    cell: ({ row }) => <span>{`EXP #${row.original.tranId}`}</span>,
  },
  {
    accessorKey: "expenses",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Expenses" />;
    },
    cell: ({ row }) => (
      <div>
        {row.original.expenses &&
          row.original.expenses.map((expense) => (
            <div key={expense._id} className="flex gap-2">
              <span>{expense.merchantName}</span>
            </div>
          ))}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => <span>{row.original.status}</span>,
  },
  {
    accessorKey: "submittedAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Submitted At" />;
    },
    cell: ({ row }) => {
      const { settings } = useSettings();

      return (
        <span>
          {row.original.submittedAt &&
            moment(row.original.submittedAt).format(
              `${settings?.dateFormat} ${settings?.timeFormat}`
            )}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <div className="flex gap-2">
        <Button
          onClick={() => {
            table.options.meta?.handleSubmitReport(row);
          }}
          disabled={row.original.isSending}
        >
          {row.original.isSending && (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
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
