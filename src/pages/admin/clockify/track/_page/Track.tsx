// @ts-nocheck
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import moment from "moment-timezone";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { columns } from "./components/columns";
import { DataTable } from "./components/DataTable";
import { Button } from "@/components/ui/button";

import { useClockifyTrackStore } from "./zustand/useClockifyTrackStore";

import { HeaderPortal } from "@/pages/_page/HeaderPortal";

import { getProjects } from "@/api/clockify/projects";
import {
  getLineTimesheets,
  submitTimeEntries,
} from "@/api/clockify/lineTimesheets";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";
import { EditTimeEntryDescriptionDialog } from "./components/EditTimeEntryDescriptionDialog";
import { WeekSelector } from "./components/WeekSelector";

export const Track = () => {
  const { weekStartDate, setProjects, setWeekStartDate, deleteLineTimesheet } =
    useClockifyTrackStore();

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["clockifyProjects"],
    queryFn: async () => {
      return await getProjects({});
    },
  });

  // useEffect(() => {
  //   setWeekStartDate(moment().startOf("isoWeek").format("YYYY-MM-DD"));
  // }, []);

  useEffect(() => {
    if (!isProjectsLoading) {
      setProjects(projects);
    }
  }, [isProjectsLoading]);

  const mutation = useMutation({
    mutationFn: () => submitTimeEntries({ weekStartDate }),
  });

  const handleSubmit = async () => {
    try {
      const resp = await mutation.mutateAsync();
      toast.success("Submitted time entries successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error submitting time entries!");
    }
  };

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Track</h1>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </HeaderPortal>
      <div className="p-4 flex flex-col gap-4">
        <WeekSelector />
        <DataTable columns={columns} />
        <DeleteConfirmationDialog
          title="Do you want to remove this timesheet?"
          onConfirm={async (dialogData) => {
            try {
              await deleteLineTimesheet(dialogData);
              toast.success("Timesheet removed successfully!");
            } catch {
              toast.error("Failed to remove timesheet!");
            }
          }}
        />
        <EditTimeEntryDescriptionDialog />
      </div>
    </div>
  );
};
