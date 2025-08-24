// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import {
  CalendarDaysIcon,
  RotateCcwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  FileIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import moment from "moment-timezone";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { StatusField } from "@/components/fields/StatusField";
import { ComboboxField } from "@/components/fields/ComboboxField";

import { SelectField } from "@/components/fields/SelectField";

const DEFAULT_VALUES = {
  dateRange: "all",
  dateFrom: "",
  dateTo: "",
};

export const DATE_RANGE_OPTIONS = [
  {
    key: "all",
    label: "All",
    dateRangeFn: () => ["", ""],
  },
  {
    key: "today",
    label: "Today",
    dateRangeFn: () => {
      const today = moment().format("YYYY-MM-DD");
      return [today, today];
    },
  },
  {
    key: "yesterday",
    label: "Yesterday",
    dateRangeFn: () => {
      const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
      return [yesterday, yesterday];
    },
  },
  {
    key: "thisWeek",
    label: "This Week",
    dateRangeFn: () => {
      const thisWeekStart = moment().startOf("week").format("YYYY-MM-DD");
      const thisWeekEnd = moment().endOf("week").format("YYYY-MM-DD");
      return [thisWeekStart, thisWeekEnd];
    },
  },
  {
    key: "last7days",
    label: "Last 7 Days",
    dateRangeFn: () => {
      const last7days = moment().subtract(7, "days").format("YYYY-MM-DD");
      return [last7days, moment().format("YYYY-MM-DD")];
    },
  },
  {
    key: "lastWeek",
    label: "Last Week",
    dateRangeFn: () => {
      const lastWeekStart = moment()
        .subtract(1, "week")
        .startOf("week")
        .format("YYYY-MM-DD");
      const lastWeekEnd = moment()
        .subtract(1, "week")
        .endOf("week")
        .format("YYYY-MM-DD");
      return [lastWeekStart, lastWeekEnd];
    },
  },
  {
    key: "thisMonth",
    label: "This Month",
    dateRangeFn: () => {
      const thisMonth = moment().startOf("month").format("YYYY-MM-DD");
      return [thisMonth, moment().format("YYYY-MM-DD")];
    },
  },
  {
    key: "lastMonth",
    label: "Last Month",
    dateRangeFn: () => {
      const lastMonth = moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD");
      const lastMonthEnd = moment()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD");
      return [lastMonth, lastMonthEnd];
    },
  },
  {
    key: "thisQuarter",
    label: "This Quarter",
    dateRangeFn: () => {
      const thisQuarterStart = moment().startOf("quarter").format("YYYY-MM-DD");
      const thisQuarterEnd = moment().endOf("quarter").format("YYYY-MM-DD");
      return [thisQuarterStart, thisQuarterEnd];
    },
  },
  {
    key: "lastQuarter",
    label: "Last Quarter",
    dateRangeFn: () => {
      const lastQuarterStart = moment()
        .subtract(1, "quarter")
        .startOf("quarter")
        .format("YYYY-MM-DD");
      const lastQuarterEnd = moment()
        .subtract(1, "quarter")
        .endOf("quarter")
        .format("YYYY-MM-DD");
      return [lastQuarterStart, lastQuarterEnd];
    },
  },
  {
    key: "thisYear",
    label: "This Year",
    dateRangeFn: () => {
      const thisYear = moment().startOf("year").format("YYYY-MM-DD");
      return [thisYear, moment().format("YYYY-MM-DD")];
    },
  },
  {
    key: "lastYear",
    label: "Last Year",
    dateRangeFn: () => {
      const lastYear = moment()
        .subtract(1, "year")
        .startOf("year")
        .format("YYYY-MM-DD");
      const lastYearEnd = moment()
        .subtract(1, "year")
        .endOf("year")
        .format("YYYY-MM-DD");
      return [lastYear, lastYearEnd];
    },
  },
  {
    key: "custom",
    label: "Custom Range",
  },
];

type DataTableFilterProps = {
  filters: any;
  setFilters: any;
};

export const DataTableFilter: React.FC<DataTableFilterProps> = ({
  filters,
  setFilters,
}) => {
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const [showFilters, setShowFilters] = useState(true);

  const filterCount = useMemo(() => {
    return Object.keys(filters).reduce((filterCount, key: string) => {
      // if (JSON.stringify(filters[key]) != JSON.stringify(DEFAULT_VALUES[key])) {
      //   return filterCount + 1;
      // }
      if (key === "status") {
        if (
          JSON.stringify(filters[key].sort()) !=
          JSON.stringify(DEFAULT_VALUES[key].sort())
        ) {
          return filterCount + 1;
        }
      } else {
        // @ts-ignore
        if (filters[key] != DEFAULT_VALUES[key]) {
          return filterCount + 1;
        }
      }
      return filterCount;
    }, 0);
  }, [filters]);

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleReset = () => {
    form.reset({ ...DEFAULT_VALUES, dateRange: "all" });
  };

  const dateRange = form.watch("dateRange");
  const dateFrom = form.watch("dateFrom");
  const dateTo = form.watch("dateTo");

  const handleFilter = (values: any) => {
    setFilters(values);
  };

  useEffect(() => {
    handleFilter({
      dateFrom,
      dateTo,
    });
  }, [dateFrom, dateTo]);

  useEffect(() => {
    const dateRangeOption = DATE_RANGE_OPTIONS.find(
      (option) => option.key === dateRange
    );
    if (dateRangeOption && dateRangeOption.dateRangeFn) {
      const [from, to] = dateRangeOption.dateRangeFn();
      form.setValue("dateFrom", from);
      form.setValue("dateTo", to);
    }
  }, [dateRange]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
          <div className="flex gap-4">
            <Button size="sm" onClick={handleShowFilters}>
              <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {filterCount !== 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filterCount}
                </Badge>
              )}
            </Button>

            {filterCount !== 0 && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={handleReset}
              >
                <RotateCcwIcon className="mr-2 h-4 w-4" /> Reset
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex gap-4">
                <div className="flex items-center h-[40px]">
                  <CalendarDaysIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
                  <SelectField
                    name="dateRange"
                    label=""
                    placeholder="Select Date Range..."
                    options={DATE_RANGE_OPTIONS}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.key}
                  />
                  <InputField
                    name="dateFrom"
                    type="date"
                    // readOnly={dateRange !== "custom"}
                  />
                  <InputField
                    name="dateTo"
                    type="date"
                    // readOnly={dateRange !== "custom"}
                  />
                </div>
              </div>

              {/* <div className="flex gap-4">
                <div className="flex items-center h-[40px]">
                  <SearchIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
                  <ComboboxField
                    name="attendee"
                    label=""
                    options={[
                      { value: "mine", label: "My expenses only" },
                      ...(authUser.role === "admin"
                        ? [
                            { value: "others", label: "Other Submitters" },
                            { value: "all", label: "All Submitters" },
                          ]
                        : []),
                      ,
                    ]}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                  />
                </div>
              </div> */}

              {/* <div className="flex gap-4">
                <div className="flex items-center h-[40px]">
                  <FileIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 flex align-center">
                  <StatusField
                    name="status"
                    label="Status"
                    options={expenseStatuses}
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                  />
                </div>
              </div> */}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
