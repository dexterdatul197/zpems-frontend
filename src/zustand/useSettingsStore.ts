import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

import { getSettings } from "@/api/settings";
import { useEffect } from "react";

type SettingsStore = {
  settings: {
    dateFormat?: string;
    timeFormat?: string;
  };
};

export const useSettingsStore = create<SettingsStore>()(() => ({
  settings: {},
}));

export const settingsActions = {
  getDateFormat: () => {
    return useSettingsStore.getState().settings?.dateFormat || "YYYY-MM-DD";
  },

  getTimeFormat: () => {
    return useSettingsStore.getState().settings?.timeFormat || "HH:mm";
  },
};

export const useSettings = () => {
  const { settings } = useSettingsStore();
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      return await getSettings();
    },
  });

  useEffect(() => {
    if (settingsData && !isLoading) {
      useSettingsStore.setState({ settings: settingsData });
    }
  }, [settingsData, isLoading]);

  return { settings };
};
