//@ts-nocheck

import { useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getSettings, updateSettings } from "@/api/settings";

import { ReportSettingsForm } from "./components/ReportSettingsForm";
import { toast } from "sonner";
import { HeaderPortal } from "@/pages/_page/HeaderPortal";

export const ReportSettings = () => {
  const queryClient = useQueryClient();
  const formRef = useRef(null);

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
    } catch (error) {
      console.error(error);
      toast.error("Error updating settings");
    }
  };

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Expense Report Settings</h1>
      </HeaderPortal>
      <div className="p-4 max-w-2xl">
        {!isLoading && (
          <ReportSettingsForm
            onSubmit={handleUpdate}
            initialValues={data}
            ref={formRef}
          />
        )}
      </div>
    </div>
  );
};
