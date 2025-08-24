//@ts-nocheck

import { useDispatch } from "react-redux";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setDialogOpen } from "@/redux/slices/dialogs";

import { syncCurrencies } from "@/api/currencies";

import { columns } from "./components/columns";
import { DataTable } from "./components/DataTable";
import {
  ADD_CURRENCY_DIALOG_ID,
  AddCurrencyDialog,
} from "./components/AddCurrencyDialog";
import { EditCurrencyDialog } from "./components/EditCurrencyDialog";
import { HeaderPortal } from "@/pages/_page/HeaderPortal";

export const CurrencySettings = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({ mutationFn: syncCurrencies });

  const handleSync = async () => {
    try {
      const resp = await mutation.mutateAsync();
      toast.success(resp.message);
      queryClient.invalidateQueries(["currencies"]);
    } catch (error) {
      console.error(error);
      toast.error("Error syncing currencies");
    }
  };

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Currencies</h1>
        <div className="flex gap-2">
          <Button onClick={handleSync} disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sync
          </Button>

          <Button
            className="ml-auto"
            onClick={() => {
              dispatch(
                setDialogOpen({
                  id: ADD_CURRENCY_DIALOG_ID,
                  open: true,
                  dialogData: {},
                })
              );
            }}
          >
            New Currency
          </Button>
        </div>
      </HeaderPortal>
      <div className="p-4">
        <DataTable columns={columns} />
      </div>
      <AddCurrencyDialog />
      <EditCurrencyDialog />
    </div>
  );
};
