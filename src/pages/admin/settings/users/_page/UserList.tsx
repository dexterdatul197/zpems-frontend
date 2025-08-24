//@ts-nocheck

import { useDispatch } from "react-redux";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setDialogOpen } from "@/redux/slices/dialogs";

import { syncUsers } from "@/api/users";

import { columns } from "./components/columns";
import { DataTable } from "./components/DataTable";
import { ADD_USER_DIALOG_ID, AddUserDialog } from "./components/AddUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { HeaderPortal } from "@/pages/_page/HeaderPortal";

export const UserList = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({ mutationFn: syncUsers });

  const handleSync = async () => {
    try {
      const resp = await mutation.mutateAsync();
      toast.success(resp.message);
      queryClient.invalidateQueries(["users"]);
    } catch (error) {
      console.error(error);
      toast.error("Error syncing users");
    }
  };

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Users</h1>
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
                  id: ADD_USER_DIALOG_ID,
                  open: true,
                  dialogData: {},
                })
              );
            }}
          >
            New User
          </Button>
        </div>
      </HeaderPortal>
      <div className="p-4">
        <DataTable columns={columns} />
      </div>
      <AddUserDialog />
      <EditUserDialog />
    </div>
  );
};
