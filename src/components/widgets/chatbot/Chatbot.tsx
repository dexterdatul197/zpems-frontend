// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  HoverCardArrow,
} from "@/components/ui/hover-card";
import useRecorder from "./useRecorder";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { parseAudio } from "@/api/clockify/timeEntries";
import {
  AddTimeEntryDialog,
  ADD_TIME_ENTRY_DIALOG,
} from "@/pages/admin/clockify/time-entries/_page/components/AddTimeEntryDialog";
import { dialogActions } from "@/zustand/useDialogStore";

export const Chatbot = () => {
  const { recorderState, startRecording, saveRecording, cancelRecording } =
    useRecorder();
  const [isOpen, setIsOpen] = useState(false);
  const avatarRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (recorderState.initRecording) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [recorderState.initRecording]);

  const uploadAudio = async (audioBlob) => {
    try {
      //   const data = await uploadFile(audioBlob);
      const { timeEntryJson, transcription } = await parseAudio(audioBlob);
      console.log(timeEntryJson);
      console.log(transcription);

      const { ProjectId, TaskId, Duration, Memo } = timeEntryJson;

      dialogActions.openDialog(ADD_TIME_ENTRY_DIALOG, {
        duration: Duration,
        description: Memo,
        lineTimesheet: {
          projectInternalId: ProjectId,
          taskInternalId: TaskId,
        },
        //date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.log(error);
    }

    cancelRecording();
  };

  useEffect(() => {
    if (recorderState.audioBlob) {
      console.log("uploading audio");
      uploadAudio(recorderState.audioBlob);
    }
  }, [recorderState.audioBlob]);

  const handleTimelog = () => {
    console.log("Timelog");
    if (contentRef.current) {
      contentRef.current.style.display = "none";
    }

    startRecording();
    // setIsOpen(true);
  };
  return (
    <>
      <div className="chatbot fixed bottom-2 right-2 z-[9999]">
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Avatar className="w-16 h-16" ref={avatarRef} id="chatbot-avatar">
              <AvatarImage src="/chatbot.png" className="hover:opacity-90" />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-30 p-0" align="end" ref={contentRef}>
            <div className="flex flex-col justify-between space-y-1">
              <Button variant="ghost" className="rounded-none">
                Expense
              </Button>
              <Button
                variant="ghost"
                className="rounded-none"
                onClick={handleTimelog}
              >
                Timelog
              </Button>
            </div>
            <HoverCardArrow className="HoverCardArrow" />
          </HoverCardContent>
        </HoverCard>
      </div>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          saveRecording();
        }}
      >
        <DialogContent
          className="sm:max-w-[425px] bg-transparent border-none shadow-none"
          hideCloseButton={true}
          onClick={() => {
            saveRecording();
          }}
        >
          <div className="text-center text-white">Recording...</div>
        </DialogContent>
      </Dialog>
      <AddTimeEntryDialog />
    </>
  );
};
