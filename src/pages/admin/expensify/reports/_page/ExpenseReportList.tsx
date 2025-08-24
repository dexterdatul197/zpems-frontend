// @ts-nocheck

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { setDialogOpen } from "@/redux/slices/dialogs";
import {
  getExpenseReports,
  importExpenseReportsFromCSV,
} from "@/api/expenseReports";

import { columns } from "./components/columns";
import { DataTable } from "./components/DataTable";
import {
  ADD_EXPENSE_REPORT_DIALOG_ID,
  AddExpenseReportDialog,
} from "./components/AddExpenseReportDialog";
import { EditExpenseReportDialog } from "./components/EditExpenseReportDialog";
import { HeaderPortal } from "@/pages/_page/HeaderPortal";

export const ExpenseReportList = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    name: "",
    tranId: "",
    status: ["open", "submitted", "approved", "rejected"],
  });

  const { data, isLoading } = useQuery({
    queryKey: ["expenseReports", pagination, sorting, filters],
    queryFn: async () => {
      const res = await getExpenseReports({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting: sorting.map(({ id, desc }) => (desc ? "-" + id : id)),
        ...filters,
      });
      return {
        rows: res.data,
        pageCount: res.pagination.pageCount,
      };
    },
  });

  const handleExport = async () => {
    const expenseReports = await getExpenseReports({
      ...filters,
    });
    const csvString = [
      [
        "ExpenseReportID",
        "ReportName",
        "ExpenseReportDate",
        "TranId",
        "Status",
        "SubmittedAt",
        "ExpenseID", // expense columns from here
        "Merchant",
        "ExpenseDate",
        "Total",
        "Category",
      ],
      ...expenseReports.data.flatMap((expenseReport) =>
        expenseReport.expenses.length > 0
          ? expenseReport.expenses.map((expense) => [
              expenseReport._id,
              expenseReport.name,
              expenseReport.date,
              expenseReport.tranId,
              expenseReport.status,
              expenseReport.submittedAt,
              expense._id, // Replace with actual fields from your API data
              expense.merchantName,
              expense.date,
              expense.total,
              expense.category.name,
            ])
          : [
              [
                expenseReport._id,
                expenseReport.name,
                expenseReport.date,
                expenseReport.tranId,
                expenseReport.status,
                expenseReport.submittedAt,
                "", // Blank expense fields
                "",
                "",
                "",
                "",
              ],
            ]
      ),
    ]
      .map((e) => e.join(","))
      .join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "expenseReports.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImport = () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.style.display = "none";
    document.body.appendChild(input);

    // Trigger the file input
    input.click();

    // Handle the file input change
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Prepare the file to be sent in a FormData object
      const formData = new FormData();
      formData.append("csvfile", file);

      // Send the file to your API
      try {
        await importExpenseReportsFromCSV(formData);

        // Optional: Update your UI or state to reflect the imported data
        queryClient.invalidateQueries(["expenseReports"]);
        toast.success("Expense Reports imported");
      } catch (error) {
        toast.error("Error importing expense reports");
        console.error("Error during import:", error);
      }
    };

    // Remove the file input element from the document
    document.body.removeChild(input);
  };

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Expense Reports</h1>
        <div className="flex gap-2">
          <Button onClick={handleImport}>Import</Button>
          <Button onClick={handleExport}>Export</Button>

          <Button
            className="ml-auto"
            onClick={() => {
              dispatch(
                setDialogOpen({
                  id: ADD_EXPENSE_REPORT_DIALOG_ID,
                  open: true,
                  dialogData: {},
                })
              );
            }}
          >
            New
          </Button>
        </div>
      </HeaderPortal>
      <div className="p-4">
        <DataTable
          data={data?.rows || []}
          columns={columns}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          filters={filters}
          setFilters={setFilters}
          pageCount={data?.pageCount || -1}
        />
      </div>
      <AddExpenseReportDialog />
      <EditExpenseReportDialog />
    </div>
  );
};
