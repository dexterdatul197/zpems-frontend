// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import moment from "moment-timezone";

import { settingsActions } from "@/zustand/useSettingsStore";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "@/components/widgets/data-table/DataTableColumnHeader";

export const columns: ColumnDef[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Start Date" />;
    },
    cell: ({ row }) => {
      return (
        <span>
          {moment(row.original._id).format(settingsActions.getDateFormat())}
        </span>
      );
    },
  },
  {
    accessorKey: "totalDuration",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total Hours" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.totalDuration} Hours</span>;
    },
  },

  {
    id: "actions",
    cell: ({ row, table }) => {
      const navigate = useNavigate();

      return (
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => {
              navigate(`/clockify/track/?weekStartDate=${row.original._id}`);
            }}
          >
            Edit
          </Button>
        </div>
      );
    },
  },
];
