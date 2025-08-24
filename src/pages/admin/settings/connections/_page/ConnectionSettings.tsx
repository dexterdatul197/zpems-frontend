//@ts-nocheck

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getSettings,
  testNetsuiteConnection,
  updateSettings,
} from "@/api/settings";

import { ConnectionSettingsForm } from "./components/ConnectionSettingsForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HeaderPortal } from "@/pages/_page/HeaderPortal";

export const MaskedValue = ({ value }) => {
  // const masked = "*********************";

  const newValue = value || "";

  const masked = newValue.slice(0, -4).replace(/./g, "*");

  const lastFour = newValue.slice(-4);

  return (
    <span>
      {masked}
      {lastFour}
    </span>
  );
};

export const ConnectionSettings = () => {
  const queryClient = useQueryClient();
  const formRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      return await getSettings();
    },
  });

  const handleUpdate = async (data: any) => {
    try {
      await updateSettings(data);
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries(["settings"]);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Error updating settings");
    }
  };

  const handleTestConnection = async () => {
    try {
      const { ok } = await testNetsuiteConnection();
      if (ok) {
        toast.success("Connection successful");
      } else {
        toast.error("Connection failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Connection failed");
    }
  };

  const { accountId, consumerKey, consumerSecret, tokenId, tokenSecret } =
    data?.netsuiteConnectionInfo ?? {};

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Connections</h1>
      </HeaderPortal>

      <div className="p-4 max-w-2xl">
        <div className="flex justify-between items-center gap-4">
          <h2 className="text-xl mb-2">Netsuite Connection Info</h2>

          {!isEditing && (
            <div className="flex gap-2">
              <Button type="button" onClick={handleTestConnection}>
                Test Connection
              </Button>
              <Button type="button" onClick={() => setIsEditing(!isEditing)}>
                Edit
              </Button>
            </div>
          )}
        </div>

        {!isLoading && isEditing && (
          <ConnectionSettingsForm
            onSubmit={handleUpdate}
            initialValues={{ netsuiteConnectionInfo: { accountId } }}
            ref={formRef}
          />
        )}
        {!isLoading && !isEditing && (
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex justify-between gap-2">
              <strong>Account ID:</strong>
              <span>{accountId}</span>
            </div>
            <div className="flex justify-between gap-2">
              <strong>Consumer Key:</strong>
              <MaskedValue value={consumerKey} />
            </div>
            <div className="flex justify-between gap-2">
              <strong>Consumer Secret:</strong>
              <MaskedValue value={consumerSecret} />
            </div>
            <div className="flex justify-between gap-2">
              <strong>Token ID:</strong>
              <MaskedValue value={tokenId} />
            </div>
            <div className="flex justify-between gap-2">
              <strong>Token Secret:</strong>
              <MaskedValue value={tokenSecret} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
