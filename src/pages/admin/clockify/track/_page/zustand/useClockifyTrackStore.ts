// @ts-nocheck
import { useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";

import {
  getLineTimesheets,
  createLineTimesheet,
  updateLineTimesheet,
  updateLineTimesheetTimeEntry as updateLineTimesheetTimeEntryApi,
  deleteLineTimesheet as deleteLineTimesheetApi,
} from "@/api/clockify/lineTimesheets";

export const getDateForWeekday = (day, weekStartDate) => {
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return moment(weekStartDate)
    .startOf("isoWeek")
    .add(days.indexOf(day), "days")
    .format("YYYY-MM-DD");
};

export const useClockifyTrackStore = create((set, get) => ({
  weekStartDate: moment()
    .startOf("isoWeek")
    .add(1, "days")
    .format("YYYY-MM-DD"),
  projects: [],
  lineTimesheets: [],

  // weekStartDate
  setWeekStartDate: async (newWeekStartDate) => {
    //format("YYYY-MM-DD") for converting the date to UTC
    newWeekStartDate = new Date(
      moment(newWeekStartDate).startOf("isoWeek").format("YYYY-MM-DD")
    );

    const lineTimesheets = await getLineTimesheets({
      weekStartDate: newWeekStartDate,
    });

    set((state) => ({
      ...state,
      weekStartDate: newWeekStartDate,
      lineTimesheets: lineTimesheets.map((wt) => ({
        ...wt,
        rowId: uuidv4(),
        timeEntries: wt.timeEntries.reduce((acc, curr) => {
          acc[moment(curr.date).format("YYYY-MM-DD")] = curr;
          return acc;
        }, {}),
      })),
    }));
  },

  // projects
  setProjects: (newProjects) => {
    set((state) => ({ ...state, projects: newProjects }));
  },
  getTasks: (projectInternalId) => {
    const project = get().projects.find(
      (p) => p.internalId === projectInternalId
    );
    return project?.tasks || [];
  },

  // lineTimesheets
  getTotalsPerDay: () => {
    const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

    const totalsPerDay = weekdays.map((day) => {
      let totalHours = 0;
      const date = getDateForWeekday(day, get().weekStartDate);
      for (const wt of get().lineTimesheets) {
        totalHours += parseFloat(wt?.timeEntries?.[date]?.duration) || 0;
      }
      return totalHours;
    });

    return totalsPerDay;
  },

  updateLineTimesheetProject: (lineTimesheet, newProjectInternalId) => {
    set((state) => {
      const newLineTimesheets = state.lineTimesheets.map((_wt) => {
        if (_wt.rowId === lineTimesheet.rowId) {
          return {
            ..._wt,
            projectInternalId: newProjectInternalId,
            taskInternalId: null,
          };
        }
        return _wt;
      });
      return { ...state, lineTimesheets: newLineTimesheets };
    });
  },

  updateLineTimesheetTask: async (lineTimesheet, newTaskInternalId) => {
    set((state) => {
      const newLineTimesheets = state.lineTimesheets.map((_wt) => {
        if (_wt.rowId === lineTimesheet.rowId) {
          return {
            ..._wt,
            taskInternalId: newTaskInternalId,
          };
        }
        return _wt;
      });

      return { ...state, lineTimesheets: newLineTimesheets };
    });

    if (!lineTimesheet._id) {
      // create a line timeshet
      const savedLineTimesheet = await createLineTimesheet({
        weekStartDate: get().weekStartDate,
        taskInternalId: newTaskInternalId,
        projectInternalId: lineTimesheet.projectInternalId,
      });

      set((state) => {
        const newLineTimesheets = state.lineTimesheets.map((_wt) => {
          if (_wt.rowId === lineTimesheet.rowId) {
            return {
              ..._wt,
              _id: savedLineTimesheet._id,
            };
          }
          return _wt;
        });

        return { ...state, lineTimesheets: newLineTimesheets };
      });
    } else {
      // update the line timeshet
      const savedLineTimesheet = await updateLineTimesheet(lineTimesheet._id, {
        projectInternalId: lineTimesheet.projectInternalId,
        taskInternalId: newTaskInternalId,
      });

      // TODO: update time entries ???
    }
  },

  updateLineTimesheetTimeEntry: async (lineTimesheet, date, timeEntry) => {
    set((state) => {
      const newLineTimesheets = state.lineTimesheets.map((_wt) => {
        if (_wt.rowId === lineTimesheet.rowId) {
          return {
            ..._wt,
            timeEntries: {
              ..._wt.timeEntries,
              [date]: {
                ..._wt.timeEntries?.[date],
                ...timeEntry,
              },
            },
          };
        }
        return _wt;
      });

      return { ...state, lineTimesheets: newLineTimesheets };
    });

    await updateLineTimesheetTimeEntryApi(lineTimesheet._id, {
      date,
      ...timeEntry,
    });
  },
  addEmptyLineTimesheet: () => {
    set((state) => ({
      ...state,
      lineTimesheets: [
        ...state.lineTimesheets,
        {
          rowId: uuidv4(),
          weekStartDate: get().weekStartDate,
          taskInternalId: null,
          projectInternalId: null,
          timeEntries: {},
        },
      ],
    }));
  },
  deleteLineTimesheet: async (lineTimesheet) => {
    set((state) => {
      const newLineTimesheets = state.lineTimesheets.filter(
        (wt) => wt.rowId !== lineTimesheet.rowId
      );

      return { ...state, lineTimesheets: newLineTimesheets };
    });

    await deleteLineTimesheetApi(lineTimesheet._id);
  },
}));

// {
//     id: "unique-timesheet-id", // useful if editing an existing timesheet
//     rowId: "unique-row-id", // used only for the UI, not stored in the database
//     taskInternalId: String,
//     projectInternalId: String,
//     weekStartDate: "2024-04-15", // date for the start of the week,
//     timeEntries: {
//       "2024-04-15": {
//         timeLogId: "unique-id-for-monday", // references the TimeLog document ID if it exists
//         duration: 0, // duration input by the user for Monday
//         date: "2024-04-15" // optional, date for the log
//       },
//       "2024-04-16": {
//         timeLogId: "unique-id-for-tuesday",
//         duration: 0,
//         date: "2024-04-16"
//       },
//       "2024-04-17": {
//         timeLogId: "unique-id-for-wednesday",
//         duration: 0,
//         date: "2024-04-17"
//       },
//       "2024-04-18": {
//         timeLogId: "unique-id-for-thursday",
//         duration: 0,
//         date: "2024-04-18"
//       },
//       "2024-04-19": {
//         timeLogId: "unique-id-for-friday",
//         duration: 0,
//         date: "2024-04-19"
//       },
//       "2024-04-20": {
//         timeLogId: "unique-id-for-saturday",
//         duration: 0,
//         date: "2024-04-20"
//       },
//       "2024-04-21": {
//         timeLogId: "unique-id-for-sunday",
//         duration: 0,
//         date: "2024-04-21"
//       }
//     }
//   }
