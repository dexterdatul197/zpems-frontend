import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import moment from "moment-timezone";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClockifyTrackStore } from "../zustand/useClockifyTrackStore";
import { useSearchParams } from "react-router-dom";

export function WeekSelector() {
  const [searchParams] = useSearchParams();
  const weekStartDateParam = searchParams.get("weekStartDate");

  const [calendarOpen, setCalendarOpen] = useState(false);

  const { weekStartDate, setWeekStartDate }: any = useClockifyTrackStore();

  const [date, setDate] = useState<Date>(new Date(weekStartDate));

  let thisWeekStartDate = moment().startOf("isoWeek");
  let lastWeekStartDate = moment().subtract(1, "weeks").startOf("isoWeek");

  const weekEndDate = moment(weekStartDate).add(6, "days").format("YYYY-MM-DD");

  useEffect(() => {
    if (weekStartDateParam) {
      setDate(new Date(weekStartDateParam));
      setWeekStartDate(new Date(weekStartDateParam));
    } else {
      setWeekStartDate(new Date(thisWeekStartDate.format("YYYY-MM-DD")));
    }
  }, [weekStartDateParam]);


  const handlePrevWeek = async () => {
    const prevWeek = date;
    prevWeek.setDate(date.getDate() - 7);

    setDate(prevWeek);
    setWeekStartDate(prevWeek);
  };

  const handleNextWeek = async () => {
    const nextWeek = date;
    nextWeek.setDate(date.getDate() + 7);

    setDate(nextWeek);
    setWeekStartDate(nextWeek);
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handlePrevWeek}>Prev</Button>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[360px] justify-start text-left font-normal flex gap-2"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {thisWeekStartDate.isSame(weekStartDate, "week") && (
              <span>This Week,</span>
            )}
            {lastWeekStartDate.isSame(weekStartDate, "week") && (
              <span>Last Week,</span>
            )}
            <span>{`${moment(weekStartDate).format(
              "YYYY-MM-DD"
            )} - ${weekEndDate}`}</span>
          </Button>
          
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (!newDate) {
                setCalendarOpen(false);
                return;
              }
              setDate(newDate);
              setWeekStartDate(newDate);
              setCalendarOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button onClick={handleNextWeek} >Next</Button>
    </div>
  );
}
