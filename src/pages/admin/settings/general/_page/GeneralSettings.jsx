//@ts-nocheck
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getSettings, updateSettings } from "@/api/settings";
import { uploadFile } from "@/api/files";

import { Button } from "@/components/ui/button";

import { GeneralSettingsForm } from "./components/GeneralSettingsForm";
import { HeaderPortal } from "@/pages/_page/HeaderPortal";

export const GeneralSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      return await getSettings();
    },
  });

  const handleUpdate = async (data) => {
    try {
      const { logo } = data;
      if (typeof logo !== "string") {
        try {
          const uploadedFile = await uploadFile(logo);
          data = { ...data, logo: uploadedFile?.fileUrl };
        } catch (error) {
          console.log(error);
          toast.error("Error uploading logo");
          // return;
        }
      }

      await updateSettings(data);
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries(["settings"]);
    } catch (error) {
      console.error(error);
      toast.error("Error updating settings");
    }
  };
  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">General Info</h1>
      </HeaderPortal>

      <div className="p-4 max-w-2xl">
        <div className="flex justify-between items-center gap-4">
          {!isLoading && (
            <GeneralSettingsForm
              onSubmit={handleUpdate}
              initialValues={settings}
            />
          )}
        </div>
      </div>
    </div>
  );
};
