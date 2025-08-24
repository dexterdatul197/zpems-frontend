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
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { StatusField } from "@/components/fields/StatusField";
import { ComboboxField } from "@/components/fields/ComboboxField";
import { SelectField } from "@/components/fields/SelectField";

import { expenseStatuses } from "@/constants/expenseGroup";
import { getCategories } from "@/api/categories";
import { DATE_RANGE_OPTIONS } from "@/pages/admin/expensify/expenses/_page/components/DataTableFilter";

export const DEFAULT_VALUES = {
  dateFrom: "",
  dateTo: "",
  merchantName: "",
  category: "",
  attendee: "mine",
  status: ["open", "submitted", "approved", "rejected"],
};

export function DataTableFilter({ filters, setFilters }: any) {
  const { authUser } = useRouteLoaderData("root");

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories", "active"],
    queryFn: getCategories,
  });

  const [showFilters, setShowFilters] = useState(true);

  const filterCount = useMemo(() => {
    return Object.keys(filters).reduce((filterCount, key: string) => {
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
  const merchantName = form.watch("merchantName");
  const category = form.watch("category");
  const attendee = form.watch("attendee");
  const status = form.watch("status");
  const dateRange = form.watch("dateRange");

  const handleFilter = (values: any) => {
    setFilters(values);
  };

  useEffect(() => {
    handleFilter({
      dateFrom,
      dateTo,
      merchantName,
      category,
      attendee,
      status,
    });
  }, [dateFrom, dateTo, merchantName, category, attendee, status]);

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

                  <InputField name="dateFrom" type="date" />
                  <InputField name="dateTo" type="date" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center h-[40px]">
                  <SearchIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
                  <InputField name="merchantName" placeholder="Merchant" />
                  <ComboboxField
                    name="category"
                    label=""
                    options={[
                      { internalId: "", name: "All Categories" },
                      ...categories,
                    ]}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.internalId}
                    placeholder="Select Category..."
                  />
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
                    ]}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                  />
                </div>
              </div>

              <div className="flex gap-4">
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
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
