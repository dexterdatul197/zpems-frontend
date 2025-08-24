import { useEffect, useMemo, useState } from "react";
import {
  CalendarDaysIcon,
  RotateCcwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  FileIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { StatusField } from "@/components/fields/StatusField";

const DEFAULT_VALUES = {
  dateFrom: "",
  dateTo: "",
  name: "",
  tranId: "",
  status: ["open", "submitted", "approved", "rejected"],
};

export const DataTableFilter: React.FC = ({ filters, setFilters }: any) => {
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const [showFilters, setShowFilters] = useState(true);

  const filterCount = useMemo(() => {
    console.log(filters);
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
    form.reset(DEFAULT_VALUES);
  };

  const dateFrom = form.watch("dateFrom");
  const dateTo = form.watch("dateTo");
  const name = form.watch("name");
  const tranId = form.watch("tranId");
  const status = form.watch("status");

  const handleFilter = (values: any) => {
    setFilters(values);
  };

  useEffect(() => {
    handleFilter({ dateFrom, dateTo, name, tranId, status });
  }, [dateFrom, dateTo, name, tranId, status]);

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
                  <InputField name="dateFrom" type="date" />
                  <InputField name="dateTo" type="date" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center h-[40px]">
                  <SearchIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
                  <InputField name="name" placeholder="Report Name" />
                  <InputField name="tranId" placeholder="Tran Id" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center h-[40px]">
                  <FileIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
                  <StatusField
                    name="status"
                    label="Status"
                    options={["Open", "Submitted", "Approved", "Rejected"]}
                    getOptionValue={(option) => option.toLowerCase()}
                    getOptionLabel={(option) => option}
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
