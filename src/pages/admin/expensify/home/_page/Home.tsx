import { useQuery } from "@tanstack/react-query";

import { DataTable } from "./components/DataTable";
import { columns } from "./components/columns";
import { ExpensesGroupDialog } from "./components/ExpensesGroupDialog";

import { getActiveCategories } from "@/api/categories";
import { HeaderPortal } from "@/pages/_page/HeaderPortal";

export const Home = () => {
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories", "active"],
    queryFn: getActiveCategories,
  });

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Home</h1>
      </HeaderPortal>
      <div className="p-4 flex flex-col gap-4">
        {!isCategoriesLoading && (
          <DataTable columns={columns} categories={categories} />
        )}
      </div>
      <ExpensesGroupDialog />
    </div>
  );
};
