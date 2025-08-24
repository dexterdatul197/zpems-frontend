// @ts-nocheck
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import moment from "moment-timezone";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

import { priceFormat } from "utils/l10n";
import PDFViewer from "@/components/widgets/PdfViewer";
import { useSettings } from "@/hooks/useSettings";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef[] = [
  {
    accessorKey: "receiptFile",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Receipt Image" />;
    },
    cell: ({ row }) => (
      <span>
        {row.original.receiptFile &&
        row.original.receiptFile.endsWith(".pdf") ? (
          <PDFViewer
            pdfUrl={row.original.receiptFile}
            // width={120}
            height={120}
          />
        ) : (
          <img className="h-[120px] w-auto" src={row.original.receiptFile} />
        )}
      </span>
    ),
  },
  {
    accessorKey: "merchantName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Merchant" />;
    },
    cell: ({ row }) => <span>{row.original.merchantName}</span>,
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
    accessorKey: "total",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total" />;
    },
    cell: ({ row }) => (
      <span>
        {row.original.total} {row.original.currency}
      </span>
    ),
  },
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
    accessorKey: "expenseReportId",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Expense Report" />;
    },
    cell: ({ row }) => (
      <span>
        {row.original.expenseReport?.tranId &&
          `EXP #${row.original.expenseReport?.tranId}`}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => <span>{row.original.expenseReport?.status}</span>,
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
