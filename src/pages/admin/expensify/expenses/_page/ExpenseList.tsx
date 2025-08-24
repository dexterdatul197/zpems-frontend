// @ts-nocheck
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SortingState, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { setDialogOpen } from "@/redux/slices/dialogs";

import { columns } from "./components/columns";
import { DataTable } from "./components/DataTable";
import {
  ADD_EXPENSE_DIALOG_ID,
  AddExpenseDialog,
} from "./components/AddExpenseDialog";
import { EditExpenseDialog } from "./components/EditExpenseDialog";

import { HeaderPortal } from "@/pages/_page/HeaderPortal";

import { getActiveCategories } from "@/api/categories";
import { getExpenses, importExpensesFromCSV } from "@/api/expenses";

export const ExpenseList = () => {
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
    merchantName: "",
    total: "",
    category: "",
    expenseReportId: "",
    status: ["open", "submitted", "approved", "rejected", "not_reported"],
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories", "active"],
    queryFn: getActiveCategories,
  });

  const { data } = useQuery({
    queryKey: ["expenses", pagination, sorting, filters],
    queryFn: async () => {
      const res = await getExpenses({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting: sorting.map(({ id, desc }) => (desc ? "-" + id : id)),
        ...filters,
      });

      return {
        expenses: res.data,
        pageCount: res.pagination.pageCount,
      };
    },
  });

  const handleExport = async () => {
    const expenses = await getExpenses({
      ...filters,
    });
    console.log(expenses);
    const csvString = [
      ["ExpenseID", "Merchant", "ExpenseDate", "Total", "Category", "Attendee"], // Replace with your headers
      ...expenses.data.map((expense) => [
        expense._id, // Replace with actual fields from your API data
        expense.merchantName,
        expense.date,
        expense.total,
        expense.category.name,
        expense.attendee,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "expenses.csv");
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
        await importExpensesFromCSV(formData);

        // Optional: Update your UI or state to reflect the imported data
        queryClient.invalidateQueries(["expenses"]);
        toast.success("Expenses imported");
      } catch (error) {
        toast.error("Error importing expenses");
        console.error("Error during import:", error);
      }
    };

    // Remove the file input element from the document
    document.body.removeChild(input);
  };

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Expenses</h1>

        <div className="flex gap-2">
          <Button onClick={handleImport}>Import</Button>
          <Button onClick={handleExport}>Export</Button>
          <Button
            onClick={() => {
              dispatch(
                setDialogOpen({
                  id: ADD_EXPENSE_DIALOG_ID,
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
        {!isCategoriesLoading && (
          <DataTable
            data={data?.expenses}
            pageCount={data?.pageCount}
            columns={columns}
            categories={categories}
            pagination={pagination}
            sorting={sorting}
            filters={filters}
            setPagination={setPagination}
            setSorting={setSorting}
            setFilters={setFilters}
          />
        )}
      </div>
      <AddExpenseDialog />
      <EditExpenseDialog />
    </div>
  );
};
