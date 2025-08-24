import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/api/settings";

export const useSettings = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      return await getSettings();
    },
  });

  return { settings, isLoading };
};
