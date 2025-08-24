//@ts-nocheck

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Separator } from "@/components/ui/separator";
import { getSettings, updateSettings } from "@/api/settings";

import { OpenAISettingsForm } from "./components/OpenAISettingsForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MaskedValue } from "../../connections/_page/ConnectionSettings";

export const OpenAISettings = () => {
  const queryClient = useQueryClient();
  const formRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      return await getSettings();
    },
  });

  const handleUpdate = async (data) => {
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

  const { openAIAPIKey } = data ?? {};

  return (
    <div>
      <div className="h-[52px] flex items-center px-4 py-2">
        <h1 className="text-xl font-bold">OpenAI</h1>
      </div>
      <Separator />
      <div className="p-4 max-w-2xl">
        <div className="flex justify-between items-center gap-4">
          <h2 className="text-xl mb-2">OpenAI Info</h2>
          {!isEditing && (
            <Button type="button" onClick={() => setIsEditing(!isEditing)}>
              Edit
            </Button>
          )}

          {/* <Button
            type="button"
            onClick={form.handleSubmit(handleTestConnection)}
          >
            Test Connection
          </Button> */}
        </div>

        {!isLoading && isEditing && (
          <OpenAISettingsForm
            onSubmit={handleUpdate}
            initialValues={{}}
            ref={formRef}
          />
        )}
        {!isLoading && !isEditing && (
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex justify-between gap-2">
              <strong>OpenAI API Key:</strong>
              <MaskedValue value={openAIAPIKey} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
